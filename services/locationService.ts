import { LocationInfo } from '../types';

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

// Country-specific medical information database
const COUNTRY_MEDICAL_INFO: Record<string, Partial<LocationInfo>> = {
  // Sub-Saharan Africa
  'Nigeria': {
    economicLevel: 'low-income',
    commonDiseases: ['Malaria', 'Tuberculosis', 'HIV/AIDS', 'Typhoid fever', 'Hepatitis B', 'Sickle cell disease'],
    availableResources: 'basic'
  },
  'Kenya': {
    economicLevel: 'low-income',
    commonDiseases: ['Malaria', 'Tuberculosis', 'HIV/AIDS', 'Typhoid fever', 'Dengue fever'],
    availableResources: 'basic'
  },
  'South Africa': {
    economicLevel: 'middle-income',
    commonDiseases: ['HIV/AIDS', 'Tuberculosis', 'Hypertension', 'Diabetes', 'Malaria'],
    availableResources: 'standard'
  },
  
  // Asia
  'India': {
    economicLevel: 'middle-income',
    commonDiseases: ['Malaria', 'Dengue fever', 'Tuberculosis', 'Diabetes', 'Typhoid fever', 'Chikungunya'],
    availableResources: 'standard'
  },
  'Bangladesh': {
    economicLevel: 'low-income',
    commonDiseases: ['Malaria', 'Dengue fever', 'Tuberculosis', 'Typhoid fever', 'Hepatitis B'],
    availableResources: 'basic'
  },
  'China': {
    economicLevel: 'middle-income',
    commonDiseases: ['Hypertension', 'Diabetes', 'Tuberculosis', 'Hepatitis B', 'Stroke'],
    availableResources: 'standard'
  },
  'Japan': {
    economicLevel: 'high-income',
    commonDiseases: ['Hypertension', 'Diabetes', 'Stroke', 'Cancer', 'Heart disease'],
    availableResources: 'advanced'
  },
  
  // Europe
  'United Kingdom': {
    economicLevel: 'high-income',
    commonDiseases: ['Heart disease', 'Cancer', 'Stroke', 'Diabetes', 'COPD'],
    availableResources: 'advanced'
  },
  'Germany': {
    economicLevel: 'high-income',
    commonDiseases: ['Heart disease', 'Cancer', 'Stroke', 'Diabetes', 'COPD'],
    availableResources: 'advanced'
  },
  'France': {
    economicLevel: 'high-income',
    commonDiseases: ['Heart disease', 'Cancer', 'Stroke', 'Diabetes', 'COPD'],
    availableResources: 'advanced'
  },
  
  // Americas
  'United States': {
    economicLevel: 'high-income',
    commonDiseases: ['Heart disease', 'Cancer', 'Stroke', 'Diabetes', 'COPD', 'Alzheimer\'s'],
    availableResources: 'advanced'
  },
  'Canada': {
    economicLevel: 'high-income',
    commonDiseases: ['Heart disease', 'Cancer', 'Stroke', 'Diabetes', 'COPD'],
    availableResources: 'advanced'
  },
  'Brazil': {
    economicLevel: 'middle-income',
    commonDiseases: ['Dengue fever', 'Zika virus', 'Tuberculosis', 'Hypertension', 'Diabetes'],
    availableResources: 'standard'
  },
  'Mexico': {
    economicLevel: 'middle-income',
    commonDiseases: ['Diabetes', 'Hypertension', 'Dengue fever', 'Tuberculosis', 'Heart disease'],
    availableResources: 'standard'
  },
  
  // Middle East
  'Saudi Arabia': {
    economicLevel: 'high-income',
    commonDiseases: ['Diabetes', 'Hypertension', 'Heart disease', 'MERS-CoV', 'Stroke'],
    availableResources: 'advanced'
  },
  'Egypt': {
    economicLevel: 'middle-income',
    commonDiseases: ['Hepatitis C', 'Diabetes', 'Hypertension', 'Tuberculosis', 'Heart disease'],
    availableResources: 'standard'
  },
  
  // Default for unknown countries
  'Unknown': {
    economicLevel: 'middle-income',
    commonDiseases: ['Hypertension', 'Diabetes', 'Heart disease', 'Stroke', 'Cancer'],
    availableResources: 'standard'
  }
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const getCountryFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    // Using a reverse geocoding service - you can replace with your preferred service
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    return data.countryName || 'Unknown';
  } catch (error) {
    console.error('Error getting country from coordinates:', error);
    return 'Unknown';
  }
};

export const getLocationInfo = async (): Promise<LocationInfo> => {
  try {
    const position = await getCurrentLocation();
    const country = await getCountryFromCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
    
    const medicalInfo = COUNTRY_MEDICAL_INFO[country] || COUNTRY_MEDICAL_INFO['Unknown'];
    
    return {
      country,
      region: getRegionFromCountry(country),
      economicLevel: medicalInfo.economicLevel || 'middle-income',
      commonDiseases: medicalInfo.commonDiseases || [],
      availableResources: medicalInfo.availableResources || 'standard'
    };
  } catch (error) {
    console.error('Error getting location info:', error);
    // Return default location info if geolocation fails
    return {
      country: 'Unknown',
      region: 'Unknown',
      economicLevel: 'middle-income',
      commonDiseases: ['Hypertension', 'Diabetes', 'Heart disease', 'Stroke', 'Cancer'],
      availableResources: 'standard'
    };
  }
};

const getRegionFromCountry = (country: string): string => {
  const regionMap: Record<string, string> = {
    'Nigeria': 'West Africa',
    'Kenya': 'East Africa',
    'South Africa': 'Southern Africa',
    'India': 'South Asia',
    'Bangladesh': 'South Asia',
    'China': 'East Asia',
    'Japan': 'East Asia',
    'United Kingdom': 'Western Europe',
    'Germany': 'Western Europe',
    'France': 'Western Europe',
    'United States': 'North America',
    'Canada': 'North America',
    'Brazil': 'South America',
    'Mexico': 'North America',
    'Saudi Arabia': 'Middle East',
    'Egypt': 'North Africa',
  };
  
  return regionMap[country] || 'Unknown';
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state === 'granted' || result.state === 'prompt';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
}; 