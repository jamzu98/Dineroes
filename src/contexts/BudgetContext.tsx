import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react';
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import Message from '../components/Message/Message';
import { AuthContext } from './AuthContext';

interface Category {
  name: string;
  amount: number;
}

interface Budget {
  monthlyBudget: number;
  categories: Category[];
}

interface BudgetContextState {
  budget: Budget | null;
  setMonthlyBudget: (budget: number) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (categoryName: string) => void;
  clearBudgetData: () => void;
}

interface BudgetProviderProps {
  children: ReactNode;
}

const BudgetContext = createContext<BudgetContextState>({
  budget: null,
  setMonthlyBudget: () => {
    console.warn('Set monthly budget not implemented');
  },
  addCategory: () => {
    console.warn('Add category not implemented');
  },
  deleteCategory: () => {
    console.warn('Delete category not implemented');
  },
  clearBudgetData: () => {
    console.warn('Clear budget data not implemented');
  },
});

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [budget, setBudget] = useState<Budget | null>({
    monthlyBudget: 0,
    categories: [],
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('authcontext not found.');

  const { isDemoUser } = authContext;

  const validateCategoryName = (categoryName: string): boolean => {
    if (categoryName.trim() === '') {
      setErrorMessage('Category must be named');
      setShowMessage(true);
      return false;
    }
    setErrorMessage(null);
    setShowMessage(false);
    return true;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (isDemoUser) {
          // Get budget from local storage
          const localBudget = localStorage.getItem('budget');
          if (localBudget) {
            setBudget(JSON.parse(localBudget));
          } else {
            const initialBudget: Budget = {
              monthlyBudget: 0,
              categories: [],
            };
            localStorage.setItem('budget', JSON.stringify(initialBudget));
            setBudget(initialBudget);
          }
        } else {
          const budgetRef = doc(firestore, 'budgets', user.uid);
          const budgetSnap = await getDoc(budgetRef);

          if (budgetSnap.exists()) {
            const budgetData = budgetSnap.data() as Budget;
            budgetData.categories = budgetData.categories.map((category) => ({
              ...category,
              amount: category.amount,
            }));
            setBudget(budgetData);
          } else {
            const initialBudget: Budget = {
              monthlyBudget: 0,
              categories: [],
            };
            await setDoc(budgetRef, initialBudget);
            setBudget(initialBudget);
          }
        }
      } else {
        setBudget(null);
      }
    });

    return unsubscribe;
  }, [isDemoUser]);

  const setMonthlyBudget = async (newBudget: number) => {
    if (isDemoUser) {
      setBudget((prevBudget) => {
        if (!prevBudget) return null;
        const updatedBudget = { ...prevBudget, monthlyBudget: newBudget };
        localStorage.setItem('budget', JSON.stringify(updatedBudget));
        return updatedBudget;
      });
    } else {
      if (!auth.currentUser) return;

      const budgetRef = doc(firestore, 'budgets', auth.currentUser.uid);

      try {
        await updateDoc(budgetRef, { monthlyBudget: newBudget });
        setBudget((prevBudget) => {
          if (!prevBudget) return null;
          return { ...prevBudget, monthlyBudget: newBudget };
        });
      } catch (error) {
        console.error('Error updating monthly budget: ', error);
      }
    }
  };

  const handleMessageVisibilityChange = (isVisible: boolean) => {
    setShowMessage(isVisible);
  };

  const addCategory = async (category: Category) => {
    if ((budget?.categories.length ?? 0) >= 20) {
      setErrorMessage('You cannot have more than 20 categories');
      setShowMessage(true);
      return;
    }
    if (isDemoUser) {
      setBudget((prevBudget) => {
        if (!prevBudget) return null;
        const updatedBudget = {
          ...prevBudget,
          categories: [...prevBudget.categories, category],
        };
        localStorage.setItem('budget', JSON.stringify(updatedBudget));
        return updatedBudget;
      });
    } else {
      if (!auth.currentUser) return;
      if (!validateCategoryName(category.name)) {
        return;
      }

      const budgetRef = doc(firestore, 'budgets', auth.currentUser.uid);

      try {
        const currentCategories = budget?.categories || [];
        if (
          !currentCategories.some(
            (existingCategory) => existingCategory.name === category.name
          )
        ) {
          await updateDoc(budgetRef, {
            categories: [...currentCategories, category],
          });
          setBudget((prevBudget) => {
            if (!prevBudget) return null;
            return {
              ...prevBudget,
              categories: [...prevBudget.categories, category],
            };
          });
        } else {
          console.warn(`CATEGORY ALREADY EXISTS: ${category.name}`);
          setErrorMessage(
            'Category already exists. Check the naming and try again.'
          );
          setShowMessage(true);
        }
      } catch (error) {
        console.error('Error adding category: ', error);
      }
    }
  };

  const deleteCategory = async (categoryName: string) => {
    if (isDemoUser) {
      setBudget((prevBudget) => {
        if (!prevBudget) return null;
        const updatedCategories = prevBudget.categories.filter(
          (category) => category.name !== categoryName
        );
        const updatedBudget = { ...prevBudget, categories: updatedCategories };
        localStorage.setItem('budget', JSON.stringify(updatedBudget));
        return updatedBudget;
      });
    } else {
      if (!auth.currentUser) return;

      const budgetRef = doc(firestore, 'budgets', auth.currentUser.uid);

      try {
        const updatedCategories = budget?.categories.filter(
          (category) => category.name !== categoryName
        );

        await updateDoc(budgetRef, {
          categories: updatedCategories,
        });
        setBudget((prevBudget) => {
          if (!prevBudget) return null;
          return {
            ...prevBudget,
            categories: updatedCategories || [],
          };
        });
      } catch (error) {
        console.error('Error deleting category: ', error);
      }
    }
  };

  const clearBudgetData = async () => {
    if (isDemoUser) {
      const initialBudget: Budget = {
        monthlyBudget: 0,
        categories: [],
      };
      localStorage.setItem('budget', JSON.stringify(initialBudget));
      setBudget(initialBudget);
    } else {
      if (!auth.currentUser) return;

      const budgetRef = doc(firestore, 'budgets', auth.currentUser.uid);
      const initialBudget: Budget = {
        monthlyBudget: 0,
        categories: [],
      };

      try {
        await setDoc(budgetRef, initialBudget);
        setBudget(initialBudget);
      } catch (error) {
        console.error('Error clearing budget data: ', error);
      }
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setMonthlyBudget,
        addCategory,
        deleteCategory,
        clearBudgetData,
      }}
    >
      {errorMessage && (
        <Message
          message={errorMessage}
          color="red"
          visible={showMessage}
          onVisibilityChange={handleMessageVisibilityChange}
        />
      )}
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;
