import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { PlanStatus, PlanStatusResponse } from '@/types/plan';
import { planService } from '@/services/api/planService';
import { useAuth } from './AuthContext';

interface PlanState {
  planStatus: PlanStatus | null;
  planVersion?: number;
  updatedAt?: string;
  isLoading: boolean;
  hasSeenPendingApproval: boolean;
}

interface PlanContextType extends PlanState {
  refreshPlanStatus: () => Promise<void>;
  markPendingApprovalSeen: () => void;
  setPlanStatusManual: (status: PlanStatus) => void; 
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  
  const [state, setState] = useState<PlanState>({
    planStatus: null,
    planVersion: undefined,
    updatedAt: undefined,
    isLoading: true,
    hasSeenPendingApproval: false,
  });

  const isFetching = useRef(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Sync with User Object from AuthContext
   * Uses 'as any' to bypass the interface error until your Auth User type is updated globally.
   */
// Sync with User Object from AuthContext
  useEffect(() => {
    // 1. Cast user to any to access fitness-specific fields
    const userDoc = user as any; 
    
    if (userDoc?.planStatus && userDoc.planStatus !== state.planStatus) {
      console.log(`[PlanContext] Syncing status from UserDoc: ${userDoc.planStatus}`);
      setState(prev => ({ 
        ...prev, 
        planStatus: userDoc.planStatus as PlanStatus, 
        isLoading: false 
      }));
    }
    // 2. Reference userDoc.planStatus here to avoid the dependency array error
  }, [user]);

  const fetchPlanStatus = async (showLoading = true): Promise<void> => {
    if (isFetching.current || !isAuthenticated) {
      if (!isAuthenticated) setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    isFetching.current = true;
    if (showLoading) setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response: PlanStatusResponse = await planService.getPlanStatus();
      
      setState(prev => ({
        ...prev,
        planStatus: response.planStatus,
        planVersion: response.planVersion,
        updatedAt: response.updatedAt,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('[PlanContext] Fetch Error:', error);
      if (error.status === 404 || error.response?.status === 404) {
        setState(prev => ({ ...prev, planStatus: 'NO_PLAN', isLoading: false }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } finally {
      isFetching.current = false;
    }
  };

  const setPlanStatusManual = (status: PlanStatus) => {
    setState(prev => ({ ...prev, planStatus: status, isLoading: false }));
  };

  const markPendingApprovalSeen = () => {
    setState(prev => ({ ...prev, hasSeenPendingApproval: true }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlanStatus();
    } else {
      setState(prev => ({ ...prev, planStatus: null, isLoading: false }));
    }
  }, [isAuthenticated]);

  /**
   * DYNAMIC POLLING
   * Automatically transitions the UI once the backend AI generator finishes.
   */
  useEffect(() => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    if (isAuthenticated && (state.planStatus === 'GENERATING' || state.planStatus === 'PENDING_APPROVAL')) {
      const interval = state.planStatus === 'GENERATING' ? 3000 : 15000;
      
      console.log(`[PlanContext] Starting polling (${interval}ms) for status: ${state.planStatus}`);
      
      pollingIntervalRef.current = setInterval(async () => {
        if (state.planStatus === 'GENERATING') {
            await refreshUser();
        }
        fetchPlanStatus(false); 
      }, interval);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [state.planStatus, isAuthenticated]);

  return (
    <PlanContext.Provider value={{ 
      ...state, 
      refreshPlanStatus: () => fetchPlanStatus(true), 
      markPendingApprovalSeen,
      setPlanStatusManual 
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used within PlanProvider');
  return context;
};