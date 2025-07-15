'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '@/components/providers/role-provider';
import { Id } from '@/convex/_generated/dataModel';

interface NavigationItem {
  label: string;
  href: string;
  roles: ('mentor' | 'mentee')[];
  icon?: React.ComponentType<{ className?: string }>;
}

interface UseRoleNavigationReturn {
  getFilteredNavItems: (items: NavigationItem[]) => NavigationItem[];
  navigateWithRoleCheck: (href: string, requiredRole?: 'mentor' | 'mentee') => void;
  canAccessRoute: (requiredRole?: 'mentor' | 'mentee') => boolean;
  getGroupSpecificRoute: (baseRoute: string, groupId?: Id<'groups'>) => string;
}

export function useRoleNavigation(): UseRoleNavigationReturn {
  const { currentRole, currentGroup } = useRole();
  const router = useRouter();
  
  const getFilteredNavItems = (items: NavigationItem[]): NavigationItem[] => {
    if (!currentRole) return [];
    
    return items.filter(item => 
      item.roles.length === 0 || item.roles.includes(currentRole)
    );
  };
  
  const canAccessRoute = (requiredRole?: 'mentor' | 'mentee'): boolean => {
    if (!requiredRole) return true;
    return currentRole === requiredRole;
  };
  
  const navigateWithRoleCheck = (
    href: string, 
    requiredRole?: 'mentor' | 'mentee'
  ): void => {
    if (canAccessRoute(requiredRole)) {
      router.push(href);
    } else {
      // Redirect to appropriate page based on role
      const fallbackRoute = currentRole === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard';
      router.push(fallbackRoute);
    }
  };
  
  const getGroupSpecificRoute = (
    baseRoute: string, 
    groupId?: Id<'groups'>
  ): string => {
    const targetGroupId = groupId || currentGroup?._id;
    if (!targetGroupId) return baseRoute;
    
    // Replace group-specific route patterns
    return baseRoute.replace('[groupId]', targetGroupId);
  };
  
  return {
    getFilteredNavItems,
    navigateWithRoleCheck,
    canAccessRoute,
    getGroupSpecificRoute,
  };
}