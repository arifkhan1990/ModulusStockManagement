
import React, { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../utils/api';

interface FeatureToggleProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureToggle: React.FC<FeatureToggleProps> = ({ 
  featureId, 
  children, 
  fallback = null 
}) => {
  const [isEnabled, setIsEnabled] = useState(true); // Default to true for development

  // Fetch feature toggles for current company
  const { data: features } = useQuery({
    queryKey: ['company-features'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/company-preference/features');
        return response.data || [];
      } catch (error) {
        console.error('Failed to fetch company features', error);
        return [];
      }
    },
    placeholderData: [
      { id: 'notifications', enabled: true },
      { id: 'sharing', enabled: true },
      { id: 'billing', enabled: true },
      { id: 'reports', enabled: true },
      { id: 'import', enabled: true }
    ]
  });

  useEffect(() => {
    if (features) {
      const feature = features.find((f: any) => f.id === featureId);
      if (feature) {
        setIsEnabled(feature.enabled);
      }
    }
  }, [featureId, features]);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
