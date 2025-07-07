import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from '../lib/auth-client';
import { useAppContext } from '../context/AppContext';
import { Icon } from '../components/Icon';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || 'Failed to sign in');
        return;
      }

      if (data) {
        // Check if user has completed onboarding
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (!hasOnboarded) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
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
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to continue your session.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Icon name="mail" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
            </button>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300">
              Forgot your password?
            </Link>
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
                <span>Signing in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-teal-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
} 