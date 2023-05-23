import React, { useEffect, useState, useContext } from 'react';
import { auth, updateProfile } from '../firebase';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import BudgetContext from '../contexts/BudgetContext';
import TransactionsContext from '../contexts/TransactionsContext';
import { AuthContext } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('authcontext not found.');

  const { isDemoUser } = authContext;

  const { clearBudgetData } = useContext(BudgetContext);
  const { clearTransactionsData } = useContext(TransactionsContext);

  useEffect(() => {
    if (auth.currentUser && !isDemoUser) {
      setDisplayName(auth.currentUser.displayName || '');
      setEmail(auth.currentUser.email || '');
    } else {
      setDisplayName('DEMO');
      setEmail('DEMO');
    }
  }, []);

  const handleClearData = () => {
    if (!window.confirm('Are you sure you want to clear all data?')) return;
    clearBudgetData();
    clearTransactionsData();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (isDemoUser)
      return setMessage(`This function isn't available in demo mode.`);

    if (newPassword !== confirmNewPassword) {
      setMessage('New password and confirmation do not match.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(
          user.email || '',
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setMessage('Password changed successfully.');
      }
    } catch (error) {
      console.error('Error changing password: ', error);
      setMessage('Error changing password. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDemoUser)
      return setMessage(`This function isn't available in demo mode.`);

    if (auth.currentUser && !isDemoUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        alert('Profile updated successfully');
      } catch (error) {
        let errorMessage = 'Error updating profile';
        if (error instanceof Error) {
          errorMessage += ': ' + error.message;
        }
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
      <form
        className="w-full max-w-sm mx-auto mt-4 mb-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="displayName"
          >
            Display Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Profile
          </button>
        </div>
      </form>
      <form
        onSubmit={handleChangePassword}
        className="w-full max-w-sm mx-auto mt-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="current-password"
          >
            Current Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="new-password"
          >
            New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirm-new-password"
          >
            Confirm New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-new-password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Change Password
          </button>
        </div>
        {message && (
          <div className="mt-4 text-center text-red-600">{message}</div>
        )}
      </form>
      <div className="w-full max-w-sm mx-auto mt-4">
        <button
          onClick={handleClearData}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
};

export default Profile;
