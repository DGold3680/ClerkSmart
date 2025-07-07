'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '../../components/Icon';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // TODO: Implement password reset functionality with Better Auth
      // For now, just show a message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('If an account with that email exists, we\'ve sent you a password reset link.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col p-6 transition-colors duration-300">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => router.push('/login')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon name="arrow-left" size={24} />
        </button>
      </header>

      <main className="flex-grow flex flex-col justify-center w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your email to receive a reset link.</p>
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-teal-500 hover:underline">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
} 