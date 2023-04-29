import React, { useState } from 'react';
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      setShowConfirmationMessage(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        {!showSignUp ? `Sign In` : `Sign Up`}
      </h1>
      {!showSignUp ? (
        <form onSubmit={handleSignIn} className="w-full max-w-sm">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={toggleSignUp}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-600 mt-4"
          >
            Switch to Sign Up
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={handleSignUp} className="w-full max-w-sm mt-4">
            <div className="mb-4">
              <label
                htmlFor="signUpEmail"
                className="block text-gray-700 font-bold mb-2"
              >
                Sign Up Email
              </label>
              <input
                type="email"
                id="signUpEmail"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="signUpPassword"
                className="block text-gray-700 font-bold mb-2"
              >
                Sign Up Password
              </label>
              <input
                type="password"
                id="signUpPassword"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none hover:bg-green-600"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={toggleSignUp}
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-600 mt-4"
            >
              Switch to Sign In
            </button>
          </form>
          {showConfirmationMessage && (
            <div className="w-full max-w-sm mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p>
                Sign up successful! Please check your email to confirm your
                account before logging in.
              </p>
            </div>
          )}
        </>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SignIn;
