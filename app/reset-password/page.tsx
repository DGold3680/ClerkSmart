'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '../../components/Icon';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const validateForm = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement password reset functionality with Better Auth
      // For now, just show a message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Icon name="alert-circle" size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link 
            href="/forgot-password"
            className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transform transition-transform duration-200"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">New Password</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-white dark:bg-slate-800 py-3 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} />
            </button>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
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
                <span>Resetting...</span>
              </>
            ) : (
              <span>Reset Password</span>
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