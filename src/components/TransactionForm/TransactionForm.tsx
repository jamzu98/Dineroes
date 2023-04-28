import React, { useState, useContext } from 'react';
import TransactionsContext from '../../contexts/TransactionsContext';
import { Transaction } from '../../types';

const TransactionForm: React.FC = () => {
  const { addTransaction } = useContext(TransactionsContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const formatString = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const transaction: Transaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    addTransaction(transaction);
    setDescription('');
    setAmount('');
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4">
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(formatString(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
