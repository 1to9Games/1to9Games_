import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Login</h2>
        <form onSubmit={handleLogin} className="mb-4">
          <div className="mb-4">
            <label className="block text-yellow-500 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-yellow-500 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <Link
              to="/register"
              className="inline-block align-baseline font-bold text-sm text-yellow-500 hover:text-yellow-300"
            >
              Don't have an account? Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;