import React, { useContext, useState } from 'react';
import TransactionsContext from '../../contexts/TransactionsContext';
import Select from 'react-select';
import { Transaction } from '../../types';

const TransactionsList: React.FC = () => {
  const { transactions, deleteTransaction } = useContext(TransactionsContext);

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'description-asc', label: 'Description (A-Z)' },
    { value: 'description-desc', label: 'Description (Z-A)' },
    { value: 'amount-asc', label: 'Amount (Lowest)' },
    { value: 'amount-desc', label: 'Amount (Highest)' },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  const [sortField, sortOrder] = selectedSort.value.split('-');

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparisonValueA;
    let comparisonValueB;

    if (sortField === 'date') {
      comparisonValueA = new Date(a[sortField]);
      comparisonValueB = new Date(b[sortField]);
    } else {
      comparisonValueA = a[sortField];
      comparisonValueB = b[sortField];
    }

    if (typeof comparisonValueA === 'string') {
      const valueA = comparisonValueA.toUpperCase(); // ignore case
      const valueB = comparisonValueB.toUpperCase(); // ignore case
      if (sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      if (sortOrder === 'asc') {
        return comparisonValueA - comparisonValueB;
      } else {
        return comparisonValueB - comparisonValueA;
      }
    }
  });

  return (
    <>
      <div className="mb-4 max-w-xs mx-auto">
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700"
        >
          Sort by:
        </label>
        <Select
          id="sort"
          options={sortOptions}
          value={selectedSort}
          onChange={(selectedOption) =>
            selectedOption && setSelectedSort(selectedOption)
          }
          className="mt-1"
        />
      </div>

      <table className="mx-auto container">
        <thead>
          <tr className="text-left">
            <th className="border-b-2 border-gray-300 py-2">Description</th>
            <th className="border-b-2 border-gray-300 py-2">Amount</th>
            <th className="border-b-2 border-gray-300 py-2">Date</th>
            <th className="border-b-2 border-gray-300 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction: Transaction) => (
            <tr
              key={transaction.id}
              className={
                transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
              }
            >
              <td className="border-b-2 border-gray-300 py-2">
                {transaction.description}
              </td>
              <td className="border-b-2 border-gray-300 py-2">
                {transaction.amount}
              </td>
              <td className="border-b-2 border-gray-300 py-2">
                {formatDate(transaction.date)}
              </td>
              <td className="border-b-2 border-gray-300 py-2">
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="bg-red-500 text-white font-semibold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TransactionsList;
