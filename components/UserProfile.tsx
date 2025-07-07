import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, LogOut, Settings } from 'lucide-react';

interface UserProfileProps {
  onClose?: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, logout } = useAppContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose?.();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.name || 'User'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Member since</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <button
            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={() => {
              // Future: Navigate to settings page
              console.log('Settings clicked');
            }}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 