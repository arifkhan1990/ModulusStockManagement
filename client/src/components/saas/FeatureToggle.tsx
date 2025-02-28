
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
import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../utils/api";

interface Feature {
  id: string;
  key: string;
  name: string;
  isEnabled: boolean;
  subscriptionTiers: string[];
  rolloutPercentage: number;
  category: string;
}

interface FeatureToggleProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureToggle({ 
  featureId, 
  children, 
  fallback = null 
}: FeatureToggleProps) {
  const { user } = useAuth();
  
  const { data: feature, isLoading } = useQuery<Feature>({
    queryKey: ["feature", featureId],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `/api/features/${featureId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch feature ${featureId}`, error);
        return null;
      }
    },
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Show fallback while loading
  if (isLoading) {
    return fallback;
  }

  // If feature doesn't exist or is disabled
  if (!feature || !feature.isEnabled) {
    return fallback;
  }

  // Check if user's subscription tier has access to this feature
  const userTier = user?.subscription?.tier || "free";
  const hasAccess = feature.subscriptionTiers.includes(userTier);
  
  // If user subscription doesn't have access to this feature
  if (!hasAccess) {
    return fallback;
  }

  // Check rollout percentage using user ID as seed
  if (feature.rolloutPercentage < 100) {
    // Simple hash function for user ID to get a deterministic value between 0-100
    const hash = user?.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
    
    if (hash >= feature.rolloutPercentage) {
      return fallback;
    }
  }

  return <>{children}</>;
}
