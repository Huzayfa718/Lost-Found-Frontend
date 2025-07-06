import React, { useContext, useState } from 'react';

import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../Components/Contexts/AuthContext';

const Register = () => {
  const { creatUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleregister = (e) => {
    e.preventDefault();
    setError('');
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photoURL = form.photoURL.value;

    // Password validation
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    if (!hasUppercase || !hasLowercase || password.length < 6) {
      setError('Password must have at least 1 uppercase, 1 lowercase letter and be at least 6 characters long.');
      return;
    }

    creatUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: name,
          photoURL: photoURL
        });
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered!',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/');
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        Swal.fire({
          icon: 'success',
          title: 'Google Login Successful',
          text: 'You have logged in using Google!',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/');
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: error.message,
        });
      });
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto mt-10">
      <div className="card-body">
        <h1 className="text-3xl text-center font-bold">Register now!</h1>
        <form onSubmit={handleregister} className="fieldset">
          <label className="label">Name</label>
          <input type="text" name="name" className="input input-bordered" placeholder="Name" required />

          <label className="label">Email</label>
          <input type="email" name="email" className="input input-bordered" placeholder="Email" required />

          <label className="label">Photo URL</label>
          <input type="text" name="photoURL" className="input input-bordered" placeholder="Photo URL" required />

          <label className="label">Password</label>
          <input type="password" name="password" className="input input-bordered" placeholder="Password" required />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-2">
            <a href="/login" className="link link-hover text-sm text-blue-600">Already have an account? Login</a>
          </div>

          <button type="submit" className="btn btn-neutral mt-4 w-full">
            Register
          </button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleGoogleLogin} className="btn bg-white text-black border-[#e5e5e5] w-full">
          <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
            </g>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Register;
