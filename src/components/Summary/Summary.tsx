import React, { useContext } from 'react';
import TransactionsContext from '../../contexts/TransactionsContext';
import { Transaction } from '../../types';

const Summary: React.FC = () => {
  const { transactions } = useContext(TransactionsContext);

  const income = transactions
    .filter((transaction) => transaction.amount >= 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const balance = income + expenses;

  return (
    <div className="bg-white shadow-md rounded p-6 mx-auto my-8 max-w-4xl">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <h3 className="text-xl font-bold">Income</h3>
          <p className="text-green-500 text-2xl">{income.toFixed(2)}€</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">Expenses</h3>
          <p className="text-red-500 text-2xl">
            {Math.abs(expenses).toFixed(2)}€
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">Balance</h3>
          <p
            className={`text-2xl ${
              balance >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {balance.toFixed(2)}€
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
