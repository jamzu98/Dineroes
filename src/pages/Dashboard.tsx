import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import TransactionsList from '../components/TransactionsList/TransactionsList';
import TransactionForm from '../components/TransactionForm/TransactionForm';
import Summary from '../components/Summary/Summary';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Summary />
      <TransactionsList />
      <TransactionForm />
    </div>
  );
};

export default Dashboard;
