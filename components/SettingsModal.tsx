import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { ThemeSetting } from '../types';
import { Icon } from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsOption: React.FC<{ 
  label: string; 
  value: ThemeSetting; 
  current: ThemeSetting; 
  onClick: (value: ThemeSetting) => void;
  icon: string;
}> = ({ label, value, current, onClick, icon }) => (
  <button
    onClick={() => onClick(value)}
    className={`w-full text-left p-4 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
      current === value 
        ? 'bg-teal-500 text-white' 
        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
    }`}
    aria-pressed={current === value}
  >
    <Icon name={icon} size={20} />
    <span>{label}</span>
  </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { themeSetting, setThemeSetting, theme } = useTheme();
  const { user, isAuthenticated, logout } = useAppContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  // Get descriptive text for the current theme
  const getThemeDescription = () => {
    if (themeSetting === 'system') {
      return `System preference (${theme === 'dark' ? 'Dark' : 'Light'})`;
    } else {
      return theme === 'dark' ? 'Dark' : 'Light';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-slate-900 dark:text-white w-full max-w-sm shadow-xl transform transition-all" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="settings-title" className="text-xl font-bold">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close settings"
          >
            <Icon name="x" size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* User Section */}
          {isAuthenticated && user && (
            <div>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-3">Account</h3>
              <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
                    <Icon name="user" size={20} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="arrow-right" size={16} className="rotate-180" />
                  <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Appearance</h3>
            <div className="space-y-3">
              <SettingsOption 
                label="Light" 
                value="light" 
                current={themeSetting} 
                onClick={setThemeSetting}
                icon="sun" 
              />
              <SettingsOption 
                label="Dark" 
                value="dark" 
                current={themeSetting} 
                onClick={setThemeSetting}
                icon="moon" 
              />
              <SettingsOption 
                label="System" 
                value="system" 
                current={themeSetting} 
                onClick={setThemeSetting}
                icon="monitor" 
              />
            </div>
            
            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
              <p className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Current theme:</span>
                <span className="font-semibold flex items-center">
                  <Icon 
                    name={theme === 'dark' ? 'moon' : 'sun'} 
                    size={16} 
                    className="mr-1.5" 
                  />
                  {getThemeDescription()}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            'System' will match your device's appearance settings.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">
            Note: This app uses a shared API for demonstration purposes and has a daily usage limit. If you encounter errors, please try again later.
          </p>
        </div>
      </div>
    </div>
  );
};