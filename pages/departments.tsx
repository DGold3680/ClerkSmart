import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../context/AppContext';
import { Icon } from '../components/Icon';
import { LocationPermissionModal } from '../components/LocationPermissionModal';
import { Department } from '../types';

const DEPARTMENTS: Department[] = [
  {
    name: "Obstetrics",
    icon: "baby",
    gradient: "from-pink-500 to-rose-500",
    description: "Pregnancy, childbirth, and reproductive health",
    avatar: "/avatars/obstetrics.svg",
  },
  {
    name: "Pediatrics",
    icon: "heart",
    gradient: "from-blue-500 to-cyan-500",
    description: "Children's health and development",
    avatar: "/avatars/pediatrics.svg",
  },
  {
    name: "Gynecology",
    icon: "users",
    gradient: "from-purple-500 to-indigo-500",
    description: "Women's reproductive health",
    avatar: "/avatars/gynecology.svg",
  },
];

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-slate-900 dark:text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
      <p className="text-lg font-semibold mb-2">{message}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        This may take a moment...
      </p>
    </div>
  </div>
);

const DepartmentCard: React.FC<{
  department: Department;
  onClick: () => void;
  disabled: boolean;
}> = ({ department, onClick, disabled }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`group relative p-6 rounded-2xl border-2 border-transparent bg-slate-800 hover:bg-slate-700 cursor-pointer transition-all duration-300 ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
    }`}
  >
    <div className="flex flex-col items-center text-center space-y-4">
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${department.gradient} flex items-center justify-center text-white shadow-lg`}
      >
        <Icon name={department.icon} size={32} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{department.name}</h3>
        <p className="text-slate-300 text-sm">{department.description}</p>
      </div>
    </div>
  </div>
);

const DepartmentSelectionScreen: React.FC = () => {
  const router = useRouter();
  const { generateNewCase, isGeneratingCase, locationInfo, requestLocationAccess } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const handleSelect = async (department: Department) => {
    setError(null);
    setSelectedDepartment(department);
    
    // Check if we have location info, if not, show modal
    if (!locationInfo) {
      setShowLocationModal(true);
      return;
    }
    
    // Generate case directly if we have location info
    await generateCaseWithLocation(department);
  };

  const generateCaseWithLocation = async (department: Department) => {
    try {
      await generateNewCase(department);
      router.push("/clerking");
    } catch (err) {
      if (err instanceof Error) {
        // Check for our custom quota error message
        if (err.message.startsWith("QUOTA_EXCEEDED")) {
          setError(err.message.split(": ")[1]);
        } else {
          setError("Sorry, we couldn't create a new case right now. Please try again.");
        }
      } else {
        setError("An unknown error occurred. Please try again.");
      }
      console.error(err);
    }
  };

  const handleLocationAllow = async () => {
    setShowLocationModal(false);
    
    if (selectedDepartment) {
      // Request location access
      await requestLocationAccess();
      
      // Generate case with location info
      await generateCaseWithLocation(selectedDepartment);
    }
  };

  const handleLocationDeny = async () => {
    setShowLocationModal(false);
    
    if (selectedDepartment) {
      // Generate case without location info
      await generateCaseWithLocation(selectedDepartment);
    }
  };

  const handleLocationClose = () => {
    setShowLocationModal(false);
    setSelectedDepartment(null);
  };

  return (
    <>
      {isGeneratingCase && <LoadingOverlay message="Creating personalized case..." />}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
        onClose={handleLocationClose}
      />
      
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <Icon name="arrow-left" size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Choose a Department</h1>
            {locationInfo && (
              <p className="text-sm text-slate-400 mt-1">
                📍 Customized for {locationInfo.country}
              </p>
            )}
          </div>
          <div className="w-8"></div>
        </header>
        
        <main className="flex flex-col space-y-6 md:grid md:grid-cols-3 md:gap-6 md:space-y-0 max-w-5xl mx-auto">
          {DEPARTMENTS.map((dept) => (
            <DepartmentCard
              key={dept.name}
              department={dept}
              onClick={() => handleSelect(dept)}
              disabled={isGeneratingCase}
            />
          ))}
        </main>
        
        {error && (
          <div className="mt-8 text-center bg-red-900/50 border border-red-400 text-red-300 px-4 py-3 rounded-lg max-w-md mx-auto">
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DepartmentSelectionScreen;