import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react';
import { Transaction } from '../types';
import { auth, firestore } from '../firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  query,
  writeBatch,
} from 'firebase/firestore';
import { AuthContext } from './AuthContext';

interface TransactionsContextState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  clearTransactionsData: () => void;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

const TransactionsContext = createContext<TransactionsContextState>({
  transactions: [],
  addTransaction: () => {
    console.warn('Add transaction not implemented');
  },
  deleteTransaction: () => {
    console.warn('Delete transaction not implemented');
  },
  clearTransactionsData: () => {
    console.warn('Clear transactions data not implemented');
  },
});

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('authcontext not found.');

  const { isDemoUser } = authContext;
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (isDemoUser) {
      const storedTransactions =
        window.localStorage.getItem('demoTransactions');
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (isDemoUser) {
      window.localStorage.setItem(
        'demoTransactions',
        JSON.stringify(transactions)
      );
    }
  }, [isDemoUser, transactions]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const transactionsRef = collection(firestore, 'transactions');
    const transactionsQuery = query(
      transactionsRef,
      where('user_id', '==', user.uid)
    );
    const unsubscribe = onSnapshot(transactionsQuery, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push(doc.data() as Transaction);
      });
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    if (isDemoUser) {
      const newTransaction = {
        ...transaction,
        id: `${Date.now()}`,
      };
      setTransactions([...transactions, newTransaction]);
      return;
    }

    const newTransaction = {
      ...transaction,
      id: doc(collection(firestore, 'transactions')).id,
      user_id: user.uid,
    };

    try {
      await setDoc(
        doc(firestore, 'transactions', newTransaction.id),
        newTransaction
      );
    } catch (error) {
      console.error('Error adding transaction: ', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    if (isDemoUser) {
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      return;
    }
    try {
      await deleteDoc(doc(firestore, 'transactions', id));
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error('Error deleting transaction: ', error);
    }
  };

  const clearTransactionsData = async () => {
    if (!user) return;
    if (isDemoUser) {
      setTransactions([]);
      return;
    }

    const batch = writeBatch(firestore);
    transactions.forEach((transaction) => {
      const transactionRef = doc(firestore, 'transactions', transaction.id);
      batch.delete(transactionRef);
    });

    try {
      await batch.commit();
      setTransactions([]);
    } catch (error) {
      console.error('Error clearing transactions data: ', error);
    }
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        clearTransactionsData,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default TransactionsContext;
