import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../Components/Contexts/AuthContext';

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Send Firebase token to backend for JWT cookie
  const sendTokenToBackend = async (token) => {
    try {
      const res = await fetch('https://lostfoundserver-five.vercel.app/jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send/receive cookies
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`JWT setup failed: ${errText}`);
      }

      // Optional: check response body
      // const data = await res.json();
      // console.log("Backend response:", data);

    } catch (err) {
      console.error("Token exchange error:", err);
      throw err;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await signInUser(email, password);
      const token = await result.user.getIdToken();

      await sendTokenToBackend(token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate(location?.state || '/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const token = await result.user.getIdToken();

      await sendTokenToBackend(token);

      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate(location?.state || '/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto mt-10">
      <div className="card-body">
        <h1 className="text-3xl text-center font-bold">Login now!</h1>
        <form onSubmit={handleLogin} className="fieldset">
          <label className="label">Email</label>
          <input type="email" name="email" className="input" placeholder="Email" required />
          <label className="label">Password</label>
          <input type="password" name="password" className="input" placeholder="Password" required />
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-neutral mt-4">
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="link link-neutral">
            Register
          </Link>
        </p>

        <button onClick={handleGoogleLogin} className="btn bg-white text-black border-[#e5e5e5] mt-4">
          {/* Google SVG icon (if needed) */}
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
