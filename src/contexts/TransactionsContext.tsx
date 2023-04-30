import React, { createContext, useState, ReactNode, useEffect } from 'react';
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);

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
      // Do not update the state here, let the onSnapshot listener handle it
    } catch (error) {
      console.error('Error adding transaction: ', error);
    }
  };

  const deleteTransaction = async (id: string) => {
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
