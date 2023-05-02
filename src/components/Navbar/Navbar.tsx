import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="bg-blue-500 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dineroes</h1>
        <nav>
          <Link to="/" className="mr-4">
            Dashboard
          </Link>
          <Link to="/budgeting">Budgeting</Link>
        </nav>
        {user && (
          <div className="relative">
            <button
              className="text-white focus:outline-none hover:text-gray-100 font-bold"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              {user.displayName ? user.displayName : user.email}
            </button>
            {dropdownVisible && (
              <div
                ref={menuContainerRef}
                id="menuContainer"
                className="absolute right-0 mt-2 bg-white text-black shadow-md rounded py-2"
              >
                <Link
                  to="/profile"
                  className="w-full px-4 py-2 hover:bg-gray-200 focus:outline-none"
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 focus:outline-none"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
