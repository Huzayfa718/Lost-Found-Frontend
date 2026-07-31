import React, { useContext, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from './Contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { user, signOutUser, updateUserProfile } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY?.trim();

  const profileImage =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=2563eb&color=fff`;

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

  const updatePhotoUrl = async (photoURL) => {
    await updateUserProfile({ photoURL });
    Swal.fire({
      icon: 'success',
      title: 'Profile picture updated',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const askForPhotoUrl = async () => {
    const result = await Swal.fire({
      title: 'Change profile picture',
      input: 'url',
      inputLabel: 'Paste an image URL',
      inputPlaceholder: 'https://example.com/photo.jpg',
      showCancelButton: true,
      confirmButtonText: 'Update',
      inputValidator: (value) => {
        if (!value) return 'Please paste an image URL.';
        return undefined;
      },
    });

    if (!result.isConfirmed) return;

    try {
      await updatePhotoUrl(result.value);
    } catch (error) {
      console.error('Profile update failed:', error);
      Swal.fire('Update failed', 'Please try a different image URL.', 'error');
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!imgbbApiKey) {
      Swal.fire({
        icon: 'warning',
        title: 'Image upload key missing',
        text: 'You can still update your profile picture by pasting an image URL.',
      }).then(() => askForPhotoUrl());
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error('Image upload failed');
      }

      await updatePhotoUrl(data.data.url);
    } catch (error) {
      console.error('Photo upload failed:', error);
      Swal.fire('Upload failed', 'Please try another image or paste an image URL.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
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
            to="/lostitems"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }
          >
            Lost Items
          </NavLink>
          <NavLink
            to="/founditems"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
            }
          >
            Found Items 
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/addItems"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'
                }
              >
                Report
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
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                aria-label="Open profile dashboard"
              >
                <div className="w-10 rounded-full ring ring-blue-100">
                  <img src={profileImage} alt={user.displayName || 'User'} />
                </div>
              </button>

              <div
                tabIndex={0}
                className="dropdown-content z-[60] mt-3 w-72 rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-xl"
              >
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <img
                    src={profileImage}
                    alt={user.displayName || 'User'}
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-950 truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="py-3 space-y-1">
                  <Link
                    to="/myItems"
                    className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Manage My Posts
                  </Link>
                  <Link
                    to="/addItems"
                    className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Add New Item
                  </Link>
                  <Link
                    to="/allRecovered"
                    className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Recovered Items
                  </Link>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    {uploadingPhoto ? 'Uploading Photo...' : 'Upload Profile Photo'}
                  </button>
                  <button
                    type="button"
                    onClick={askForPhotoUrl}
                    disabled={uploadingPhoto}
                    className="block w-full rounded-md px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    Use Image URL
                  </button>
                </div>

                <button onClick={handleLogout} className="btn btn-error btn-outline w-full">
                  Logout
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
