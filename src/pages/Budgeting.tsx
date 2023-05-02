import React, { useContext, useState } from 'react';
import BudgetContext from '../contexts/BudgetContext';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Budgeting: React.FC = () => {
  const { budget, setMonthlyBudget, addCategory, deleteCategory } =
    useContext(BudgetContext);

  const [newCategory, setNewCategory] = useState({ name: '', amount: 0 });

  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(
    budget?.monthlyBudget || 0
  );

  const handleMonthlyBudgetChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value === '' || +event.target.value < 0) {
      setMonthlyBudgetInput(0);
      return;
    }
    setMonthlyBudgetInput(parseFloat(event.target.value));
  };

  const updateMonthlyBudget = () => {
    console.log(monthlyBudgetInput);
    setMonthlyBudget(monthlyBudgetInput);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'name' | 'amount'
  ) => {
    setNewCategory({
      ...newCategory,
      [field]:
        field === 'amount'
          ? parseFloat(event.target.value)
          : event.target.value,
    });
  };

  const handleAddCategory = () => {
    addCategory(newCategory);
    setNewCategory({ name: '', amount: 0 });
    (
      document.querySelector<HTMLInputElement>(
        '#categoryName'
      ) as HTMLInputElement
    )?.focus();
  };

  const calculateRemainingBudget = () => {
    if (!budget) return 0;
    const remainingBudget =
      budget.monthlyBudget -
      budget.categories.reduce((acc, category) => acc + category.amount, 0);
    return remainingBudget;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Budgeting</h1>
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="monthlyBudget"
        >
          Monthly Budget
        </label>
        <div className="flex">
          <input
            type="number"
            id="monthlyBudget"
            className="border border-gray-300 px-2 py-1 mr-2 w-full"
            value={monthlyBudgetInput}
            onChange={handleMonthlyBudgetChange}
            disabled={!budget}
          />
          <button
            className="bg-green-500 text-white px-2 py-1"
            onClick={updateMonthlyBudget}
          >
            Update
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Categories</h2>
        {budget?.categories.map((category) => (
          <div
            key={category.name}
            className="flex justify-between items-center mb-2"
          >
            <div className="flex-1 mr-2">
              <p>{category.name}</p>
              <p>{category.amount}</p>
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1"
              onClick={() => deleteCategory(category.name)}
            >
              Delete
            </button>
          </div>
        ))}
        <div className="sm:flex mb-4">
          <input
            type="text"
            id="categoryName"
            className="border border-gray-300 px-2 py-1 mr-2 flex-1"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => handleCategoryChange(e, 'name')}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
          />
          <input
            type="number"
            className="border border-gray-300 px-2 py-1 mr-2 w-full sm:w-32"
            placeholder="Amount"
            value={newCategory.amount}
            onChange={(e) => handleCategoryChange(e, 'amount')}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
          />
          <button
            className="bg-green-500 text-white px-2 py-1 w-full sm:w-auto"
            onClick={handleAddCategory}
          >
            Add
          </button>
        </div>
      </div>
      {budget && budget.categories.length > 0 && (
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/2 mb-4 sm:mb-0">
            <h2 className="text-xl font-bold mb-2">Category Distribution</h2>
            {(() => {
              const data = budget.categories.map((category) => ({
                name: category.name,
                value: category.amount,
              }));

              return (
                <PieChart width={400} height={400}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              );
            })()}
          </div>
          <div className="sm:w-1/2">
            <h2 className="text-xl font-bold mb-2">Category Details</h2>
            <table className="table-auto border-collapse border border-gray-300 w-full bg-white">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Category</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {budget.categories.map((category) => (
                  <tr key={category.name}>
                    <td className="border border-gray-300 px-4 py-2">
                      {category.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {category.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-white p-4 border-2">
              <h3 className="text-lg font-bold mt-4">Unallocated Budget</h3>
              <p
                className={
                  calculateRemainingBudget() < 0
                    ? 'text-red-600'
                    : 'text-green-600'
                }
              >{`${calculateRemainingBudget()}`}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Budgeting;
