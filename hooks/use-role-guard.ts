'use client';

import { useRole } from '@/components/providers/role-provider';

interface UseRoleGuardReturn {
  showForMentor: boolean;
  showForMentee: boolean;
  showForRole: (role: 'mentor' | 'mentee') => boolean;
  hideForRole: (role: 'mentor' | 'mentee') => boolean;
  showForAnyRole: boolean;
  showWhenLoading: boolean;
}

export function useRoleGuard(): UseRoleGuardReturn {
  const { currentRole, isLoading } = useRole();
  
  const showForMentor = currentRole === 'mentor';
  const showForMentee = currentRole === 'mentee';
  const showForAnyRole = currentRole !== null;
  const showWhenLoading = isLoading;
  
  const showForRole = (role: 'mentor' | 'mentee'): boolean => {
    return currentRole === role;
  };
  
  const hideForRole = (role: 'mentor' | 'mentee'): boolean => {
    return currentRole !== role;
  };
  
  return {
    showForMentor,
    showForMentee,
    showForRole,
    hideForRole,
    showForAnyRole,
    showWhenLoading,
  };
}