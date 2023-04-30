import React, { useState } from 'react';
import { auth, provider } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      setShowConfirmationMessage(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
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
            onClick={handleGoogleSignIn}
            className="py-2 px-4 mt-4 max-w-sm flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
            </svg>
            Sign in with Google
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
