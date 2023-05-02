import React from 'react';
import TransactionsList from '../components/TransactionsList/TransactionsList';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import Summary from '../components/Summary/Summary';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <Summary />
      <TransactionsList />
      <TransactionForm />
    </div>
  );
};

export default Dashboard;
