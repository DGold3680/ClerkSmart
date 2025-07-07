import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icon } from '../components/Icon';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const AuthScreen: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAppContext();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const hasOnboarded = localStorage.getItem('hasOnboarded');
      if (!hasOnboarded) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white flex flex-col justify-between p-6 sm:p-8 transition-colors duration-300">
      <header className="text-center my-12 flex-grow flex flex-col justify-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-teal-400 to-emerald-500 text-transparent bg-clip-text">
          ClerkSmart
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The intelligent clinical reasoning simulator.</p>
      </header>

      <main className="flex-shrink-0 w-full max-w-sm mx-auto space-y-4">
        <button
          onClick={() => router.push('/signup')}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 hover:scale-105 transform transition-transform duration-200"
        >
          <span>Create an Account</span>
          <Icon name="arrow-right" size={20} />
        </button>
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <span>Log In</span>
        </button>
      </main>

      <footer className="text-center mt-12 pb-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          By continuing, you agree to our terms and conditions.
        </p>
      </footer>
    </div>
  );
};

export default AuthScreen; 