// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login | Brevity';
    return () => {
      document.title = 'Brevity'; // Reset on unmount
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const API_URL = `${import.meta.env.VITE_API_URL}/api/users/login`;
      
      const response = await axios.post(API_URL, loginData);
      
      if (response.data.token) {
        const { token, ...userData } = response.data;
        login(userData, token);
        navigate(`/${userData.username}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert('Login Failed: ' + (error.response?.data.message || 'Please check your credentials.'));
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-surface p-8 rounded-xl border-2 border-border shadow-[8px_8px_0px_#1A1A1A]">
          <h2 className="text-3xl font-bold text-center text-text mb-8">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Button type="submit">Sign In</Button>
            </div>
          </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Need an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;