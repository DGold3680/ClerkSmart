import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { requestPasswordReset } from '../lib/auth-client';
import { Icon } from '../components/Icon';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    console.log('Attempting to send password reset for:', email);

    try {
      const { data, error } = await requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      });

      console.log('Password reset response:', { data, error });

      if (error) {
        console.error('Password reset error:', error);
        setError(error.message || 'Failed to send reset email');
        return;
      }

      setSuccess('Password reset link has been sent to your email address. Please check your inbox and spam folder.');
      console.log('Password reset request successful');
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      setError('An unexpected error occurred');
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
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
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

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

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
            Sign In
          </Link>
        </p>
      </main>
    </div>
  );
} 