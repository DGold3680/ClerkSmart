import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { CaseState, Department, Feedback, InvestigationResult, Message, Case, LocationInfo, CaseGenerationOptions } from '../types';
import { generateClinicalCase } from '../services/geminiService';
import { getLocationInfo } from '../services/locationService';
import { useSession, signOut } from '../lib/auth-client';

interface AppContextType {
  caseState: CaseState;
  isGeneratingCase: boolean;
  userEmail: string | null;
  locationInfo: LocationInfo | null;
  previousCases: string[];
  // Authentication state
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Methods
  setUserEmail: (email: string) => void;
  logout: () => Promise<void>;
  generateNewCase: (department: Department, options?: Partial<CaseGenerationOptions>) => Promise<void>;
  addMessage: (message: Message) => void;
  setPreliminaryData: (diagnosis: string, plan: string) => void;
  setInvestigationResults: (results: InvestigationResult[]) => void;
  setFinalData: (diagnosis: string, plan: string) => void;
  setFeedback: (feedback: Feedback) => void;
  resetCase: () => void;
  requestLocationAccess: () => Promise<void>;
}

const initialCaseState: CaseState = {
  department: null,
  caseDetails: null,
  messages: [],
  preliminaryDiagnosis: '',
  investigationPlan: '',
  investigationResults: [],
  finalDiagnosis: '',
  managementPlan: '',
  feedback: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [caseState, setCaseState] = useState<CaseState>(initialCaseState);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [previousCases, setPreviousCases] = useState<string[]>([]);
  const isBrowser = typeof window !== 'undefined';
  
  // Authentication state
  const { data: session, isPending } = useSession();
  const user = session?.user || null;
  const isAuthenticated = !!user;
  const isLoading = isPending;

  useEffect(() => {
    if (!isBrowser) return;
    
    // Sync user email with authenticated user
    if (user?.email) {
      setUserEmailState(user.email);
      if (isBrowser) {
        localStorage.setItem('userEmail', user.email);
      }
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail && !isAuthenticated) {
        setUserEmailState(storedEmail);
      }
    }

    const storedPreviousCases = localStorage.getItem('previousCases');
    if (storedPreviousCases) {
      setPreviousCases(JSON.parse(storedPreviousCases));
    }

    const storedLocationInfo = localStorage.getItem('locationInfo');
    if (storedLocationInfo) {
      setLocationInfo(JSON.parse(storedLocationInfo));
    }
  }, [isBrowser, user?.email, isAuthenticated]);

  const setUserEmail = (email: string) => {
    if (isBrowser) {
      localStorage.setItem('userEmail', email);
    }
    setUserEmailState(email);
  };

  const logout = async () => {
    try {
      await signOut();
      setUserEmailState(null);
      if (isBrowser) {
        localStorage.removeItem('userEmail');
      }
      resetCase();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const requestLocationAccess = async () => {
    try {
      const location = await getLocationInfo();
      setLocationInfo(location);
      if (isBrowser) {
        localStorage.setItem('locationInfo', JSON.stringify(location));
      }
    } catch (error) {
      console.error('Failed to get location info:', error);
    }
  };

  const generateDifficulty = (): CaseGenerationOptions['difficulty'] => {
    const options: CaseGenerationOptions['difficulty'][] = ['basic', 'intermediate', 'advanced'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateCategory = (): CaseGenerationOptions['category'] => {
    const options: CaseGenerationOptions['category'][] = ['acute', 'chronic', 'emergency', 'outpatient'];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const generateNewCase = useCallback(async (department: Department, options?: Partial<CaseGenerationOptions>) => {
    setIsGeneratingCase(true);
    try {
      const caseOptions: CaseGenerationOptions = {
        difficulty: options?.difficulty || generateDifficulty(),
        category: options?.category || generateCategory(),
        avoidSimilarTo: previousCases.slice(-10), // Avoid last 10 cases
        location: locationInfo || undefined,
        ...options
      };

      const newCase = await generateClinicalCase(department.name, caseOptions);
      if (!newCase) {
        throw new Error(`Failed to generate a case for ${department.name}`);
      }

      // Store this case in previous cases
      const updatedPreviousCases = [...previousCases, newCase.diagnosis];
      setPreviousCases(updatedPreviousCases);
      if (isBrowser) {
        localStorage.setItem('previousCases', JSON.stringify(updatedPreviousCases));
      }
      
      setCaseState({
        ...initialCaseState,
        department,
        caseDetails: newCase,
        messages: [{
            sender: 'system',
            text: `You are now seeing the patient.${department.name === 'Pediatrics' ? ' Both the child and caregiver are present.' : ''}\n\nVisual Assessment:\n${newCase.visualAppearance}\n\nOpening Statement:\n"${newCase.openingLine}"`,
            timestamp: new Date().toISOString()
        }]
      });
    } catch (error) {
        console.error("Error in generateNewCase:", error);
        // Rethrow the error to be caught by the caller UI
        throw error;
    } finally {
        setIsGeneratingCase(false);
    }
  }, [locationInfo, previousCases, isBrowser]);
  
  const addMessage = useCallback((message: Message) => {
    setCaseState((prev: CaseState) => ({ ...prev, messages: [...prev.messages, message] }));
  }, []);

  const setPreliminaryData = useCallback((diagnosis: string, plan: string) => {
    setCaseState((prev: CaseState) => ({ ...prev, preliminaryDiagnosis: diagnosis, investigationPlan: plan }));
  }, []);

  const setInvestigationResults = useCallback((results: InvestigationResult[]) => {
    setCaseState((prev: CaseState) => ({ ...prev, investigationResults: results }));
  }, []);

  const setFinalData = useCallback((diagnosis: string, plan: string) => {
    setCaseState((prev: CaseState) => ({ ...prev, finalDiagnosis: diagnosis, managementPlan: plan }));
  }, []);

  const setFeedback = useCallback((feedback: Feedback) => {
    setCaseState((prev: CaseState) => ({ ...prev, feedback }));
  }, []);

  const resetCase = useCallback(() => {
    setCaseState(initialCaseState);
  }, []);

  const value = { 
    caseState, 
    isGeneratingCase, 
    userEmail, 
    locationInfo,
    previousCases,
    // Authentication state
    user,
    isAuthenticated,
    isLoading,
    // Methods
    setUserEmail,
    logout,
    generateNewCase, 
    addMessage, 
    setPreliminaryData, 
    setInvestigationResults, 
    setFinalData, 
    setFeedback, 
    resetCase,
    requestLocationAccess
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};