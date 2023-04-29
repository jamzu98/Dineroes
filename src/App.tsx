import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import { TransactionsProvider } from './contexts/TransactionsContext';
import SignIn from './components/SignIn/SignIn';
import { auth } from './firebase';

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
          <Dashboard />
        </TransactionsProvider>
      )}
    </div>
  );
};

export default App;
