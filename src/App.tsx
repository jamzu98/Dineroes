import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import { TransactionsProvider } from './contexts/TransactionsContext';
import supabase from './supabaseClient';
import SignIn from './components/SignIn/SignIn';

const App: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setSignedIn(true);
        } else {
          setSignedIn(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
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
