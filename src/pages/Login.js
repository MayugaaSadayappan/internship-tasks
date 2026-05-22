import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">🚀 Sign In</h2>
        {error && <p className="bg-red-500/20 text-red-400 p-2.5 rounded text-sm text-center mb-4 border border-red-500/30">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
            <input type="email" className="w-full p-3 rounded bg-slate-900 border border-slate-600 focus:outline-none focus:border-blue-500 text-white" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input type="password" className="w-full p-3 rounded bg-slate-900 border border-slate-600 focus:outline-none focus:border-blue-500 text-white" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition duration-200 mt-2">Login</button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default Login;