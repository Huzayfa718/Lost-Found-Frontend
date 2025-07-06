import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from './Contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, signOutUser } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        signOutUser()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Logged out successfully',
              timer: 1500,
              showConfirmButton: false,
            });
            navigate('/login');
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Logout Failed',
              text: 'An error occurred during logout.',
            });
          });
      }
    });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          WhereIsIt
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4 flex flex-wrap items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }
          >
            Home
          </NavLink>
          

          <NavLink
            to="/allItems"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }
          >
            Lost & Found Items
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/addItems"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }
              >
                Add Item
              </NavLink>

              <NavLink
                to="/myItems"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }
              >
                Manage My Items
              </NavLink>

              <NavLink
                to="/allRecovered"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }
              >
                All Recovered Items
              </NavLink>
            </>
          )}
        </div>

        {/* Auth Buttons / Profile */}
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-500">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Profile Picture with Name Tooltip */}
              <div className="relative group">
                <img
                  src={user.photoURL || 'https://placeimg.com/192/192/people'}
                  alt="User"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {user.displayName || 'User'}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
