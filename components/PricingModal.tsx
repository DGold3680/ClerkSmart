import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { useAppContext } from '../context/AppContext';
import { useCustomer } from 'autumn-js/react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Product IDs that should match your Autumn dashboard
const PRODUCTS = {
  PRO_STANDARD: 'pro-standard',
  PRO_EMERGING: 'pro-emerging', 
  PRO_DEVELOPING: 'pro-developing',
};

// Location mappings for product selection
const LOCATION_TO_PRODUCT: Record<string, string> = {
  // Standard pricing regions
  'US': PRODUCTS.PRO_STANDARD,
  'CA': PRODUCTS.PRO_STANDARD,
  'GB': PRODUCTS.PRO_STANDARD,
  'AU': PRODUCTS.PRO_STANDARD,
  'DE': PRODUCTS.PRO_STANDARD,
  'FR': PRODUCTS.PRO_STANDARD,
  'NL': PRODUCTS.PRO_STANDARD,
  'SE': PRODUCTS.PRO_STANDARD,
  'NO': PRODUCTS.PRO_STANDARD,
  'DK': PRODUCTS.PRO_STANDARD,
  
  // Emerging markets
  'IN': PRODUCTS.PRO_EMERGING,
  'BR': PRODUCTS.PRO_EMERGING,
  'MX': PRODUCTS.PRO_EMERGING,
  'AR': PRODUCTS.PRO_EMERGING,
  'CL': PRODUCTS.PRO_EMERGING,
  'CO': PRODUCTS.PRO_EMERGING,
  'PE': PRODUCTS.PRO_EMERGING,
  'PH': PRODUCTS.PRO_EMERGING,
  'TH': PRODUCTS.PRO_EMERGING,
  'VN': PRODUCTS.PRO_EMERGING,
  'ID': PRODUCTS.PRO_EMERGING,
  'MY': PRODUCTS.PRO_EMERGING,
  
  // Developing regions
  'NG': PRODUCTS.PRO_DEVELOPING,
  'KE': PRODUCTS.PRO_DEVELOPING,
  'GH': PRODUCTS.PRO_DEVELOPING,
  'ZA': PRODUCTS.PRO_DEVELOPING,
  'EG': PRODUCTS.PRO_DEVELOPING,
  'BD': PRODUCTS.PRO_DEVELOPING,
  'PK': PRODUCTS.PRO_DEVELOPING,
  'LK': PRODUCTS.PRO_DEVELOPING,
  'NP': PRODUCTS.PRO_DEVELOPING,
  'MM': PRODUCTS.PRO_DEVELOPING,
};

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [userLocation, setUserLocation] = useState<string>('');
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, locationInfo } = useAppContext();
  const { attach, customer, allowed, refetch } = useCustomer();

  useEffect(() => {
    if (isOpen && user) {
      // Get user's location from context or detect it
      const location = locationInfo?.country || 'US';
      setUserLocation(location);
      
      // Refetch customer data when modal opens to ensure fresh data
      refetch();
    }
  }, [isOpen, user, locationInfo, refetch]);

  const handleSubscribe = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const productId = LOCATION_TO_PRODUCT[userLocation] || PRODUCTS.PRO_STANDARD;
      await attach({ 
        productId
      });
    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has active subscription
  const hasActiveSubscription = customer && allowed({ featureId: 'cases' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {hasActiveSubscription ? 'ClerkSmart PRO Active' : 'Upgrade to ClerkSmart PRO'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Icon name="x" size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Subscription Status */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          {hasActiveSubscription ? (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-4">
                <Icon name="check" size={16} className="mr-2" />
                PRO Subscription Active
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You have unlimited access to all features
              </p>
              {customer?.features?.cases && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Cases used: {customer.features.cases.usage || 0}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4">
                <Icon name="alert-triangle" size={16} className="mr-2" />
                Free Plan
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upgrade to PRO for unlimited case generation
              </p>
              {customer?.features?.cases && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Cases remaining: {customer.features.cases.balance || 0}
                </p>
              )}
            </div>
          )}
        </div>

        {!hasActiveSubscription && (
          <>
            {/* Pricing Card */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm font-medium mb-4">
                  <Icon name="map-pin" size={16} className="mr-2" />
                  {userLocation ? `Pricing for ${userLocation}` : 'Regional Pricing'}
                </div>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    Get pricing
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-2">
                    from Autumn
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Location-based pricing powered by Autumn
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Icon name="check" size={20} className="text-teal-500 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">Unlimited AI-generated cases</span>
                </div>
                <div className="flex items-center">
                  <Icon name="check" size={20} className="text-teal-500 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">Detailed feedback & analysis</span>
                </div>
                <div className="flex items-center">
                  <Icon name="check" size={20} className="text-teal-500 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">Email case reports</span>
                </div>
                <div className="flex items-center">
                  <Icon name="check" size={20} className="text-teal-500 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">Progress tracking</span>
                </div>
                <div className="flex items-center">
                  <Icon name="check" size={20} className="text-teal-500 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">All medical specialties</span>
                </div>
                <div className="flex items-center">
                  <Icon name="check" size={20} className="text-teal-500 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">Priority support</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Processing...' : 'Upgrade to PRO'}
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                Cancel anytime • Secure payment via Stripe
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingModal; 