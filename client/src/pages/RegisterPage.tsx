// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';

type ErrorState = {
  username?: string;
  email?: string;
  password?: string;
  form?: string;
};

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up | Brevity';
    return () => {
      document.title = 'Brevity'; // Reset on unmount
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const registrationData = { username, email, password };
      const API_URL = `${import.meta.env.VITE_API_URL}/api/users/register`;
      await axios.post(API_URL, registrationData);
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ form: err.response.data.message || 'Registration failed.' });
        }
      } else {
        setErrors({ form: 'An unexpected error occurred.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-surface p-8 rounded-xl border-2 border-border shadow-[8px_8px_0px_#1A1A1A]">
          <h2 className="text-3xl font-bold text-center text-text mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                <p>{errors.form}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="username">Username</label>
              <Input id="username" type="text" value={username} placeholder="username" onChange={(e) => setUsername(e.target.value)} className={errors.username ? 'border-red-500' : ''} required/>
              {errors.username && <p className="text-red-500 text-xs italic mt-2">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">Email Address</label>
              <Input id="email" type="email" value={email} placeholder="your email" onChange={(e) => setEmail(e.target.value)} className={errors.email ? 'border-red-500' : ''} required/>
              {errors.email && <p className="text-red-500 text-xs italic mt-2">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="password">Password</label>
              <Input id="password" type="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} className={errors.password ? 'border-red-500' : ''} required/>
              {errors.password && <p className="text-red-500 text-xs italic mt-2">{errors.password}</p>}
            </div>
            <div>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating Account...' : 'Create Account'}</Button>
            </div>
          </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;