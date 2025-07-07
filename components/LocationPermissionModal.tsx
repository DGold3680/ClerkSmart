import React from 'react';
import { Icon } from './Icon';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onAllow,
  onDeny,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-slate-900 dark:text-white max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Icon name="map-pin" size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Location Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="x" size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            ClerkSmart can customize your clinical cases based on your location to provide:
          </p>
          
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start space-x-2">
              <Icon name="check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Cases with local disease prevalence patterns</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Appropriate investigation options based on available resources</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Culturally relevant patient names and presentations</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon name="check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Management protocols suitable for your region</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
          <div className="flex items-start space-x-2">
            <Icon name="info" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your location data is only used to customize cases and is not stored or shared. 
              You can still use ClerkSmart without location access.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onDeny}
            className="flex-1 py-3 px-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Skip
          </button>
          <button
            onClick={onAllow}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
          >
            Allow Location Access
          </button>
        </div>
      </div>
    </div>
  );
}; 