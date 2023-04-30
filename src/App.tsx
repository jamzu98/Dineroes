import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Budgeting from './pages/Budgeting';
import { TransactionsProvider } from './contexts/TransactionsContext';
import SignIn from './components/SignIn/SignIn';
import { auth } from './firebase';
import { BudgetProvider } from './contexts/BudgetContext';
import Navbar from './components/Navbar/Navbar';
import Profile from './pages/Profile';

const App: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      {!signedIn ? (
        <SignIn />
      ) : (
        <TransactionsProvider>
          <BudgetProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/budgeting" element={<Budgeting />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Router>
          </BudgetProvider>
        </TransactionsProvider>
      )}
    </div>
  );
};

export default App;
