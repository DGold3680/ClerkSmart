import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signUp } from '../lib/auth-client';
import { useAppContext } from '../context/AppContext';
import { Icon } from '../components/Icon';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAppContext();

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const hasOnboarded = localStorage.getItem('hasOnboarded');
      if (!hasOnboarded) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (error) {
        setError(error.message || 'Failed to create account');
        return;
      }

      if (data) {
        // New users should go through onboarding
        router.push('/onboarding');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col p-6 transition-colors duration-300">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => router.push('/auth')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon name="arrow-left" size={24} />
        </button>
      </header>

      <main className="flex-grow flex flex-col justify-center w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start your journey with ClerkSmart.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Icon name="user" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="relative">
            <Icon name="mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="relative">
            <Icon name="lock" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="relative">
            <Icon name="lock" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-teal-500 hover:underline">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
} 