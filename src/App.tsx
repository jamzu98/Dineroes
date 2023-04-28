import React from 'react';
import Dashboard from './pages/Dashboard';
import { TransactionsProvider } from './contexts/TransactionsContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <TransactionsProvider>
        <Dashboard />
      </TransactionsProvider>
    </div>
  );
};

export default App;
