import { Doc } from '@/convex/_generated/dataModel';

export type UserRole = 'mentor' | 'mentee' | null;

export interface RoleConfig {
  defaultRole: UserRole;
  allowRoleSwitching: boolean;
  persistRoleSelection: boolean;
  fallbackBehavior: 'hide' | 'disable' | 'redirect';
}

export const DEFAULT_ROLE_CONFIG: RoleConfig = {
  defaultRole: null,
  allowRoleSwitching: true,
  persistRoleSelection: true,
  fallbackBehavior: 'hide',
};

// Role checking utilities
export const roleUtils = {
  isMentor: (role: UserRole): boolean => role === 'mentor',
  isMentee: (role: UserRole): boolean => role === 'mentee',
  hasRole: (role: UserRole): boolean => role !== null,
  
  // Role comparison utilities
  rolesMatch: (role1: UserRole, role2: UserRole): boolean => role1 === role2,
  hasAnyRole: (role: UserRole, allowedRoles: UserRole[]): boolean => 
    allowedRoles.includes(role),
  
  // Role display utilities
  getRoleDisplayName: (role: UserRole): string => {
    switch (role) {
      case 'mentor': return 'Mentor';
      case 'mentee': return 'Mentee';
      default: return 'Guest';
    }
  },
  
  getRoleColor: (role: UserRole): string => {
    switch (role) {
      case 'mentor': return 'blue';
      case 'mentee': return 'green';
      default: return 'gray';
    }
  },
  
  // Permission utilities
  canCreateContent: (role: UserRole): boolean => role === 'mentor',
  canEditContent: (role: UserRole): boolean => role === 'mentor',
  canDeleteContent: (role: UserRole): boolean => role === 'mentor',
  canViewAnalytics: (role: UserRole): boolean => role === 'mentor',
  canTakeTests: (role: UserRole): boolean => role === 'mentee',
  canViewProgress: (role: UserRole): boolean => role !== null,
  
  // Group utilities
  getUserRoleInGroup: (
    memberships: Array<{ groupId: string; role: UserRole }>,
    groupId: string
  ): UserRole => {
    const membership = memberships.find(m => m.groupId === groupId);
    return membership?.role || null;
  },
  
  // Route utilities
  getDefaultRouteForRole: (role: UserRole): string => {
    switch (role) {
      case 'mentor': return '/groups';
      case 'mentee': return '/groups';
      default: return '/';
    }
  },
  
  // Validation utilities
  isValidRole: (role: string): role is 'mentor' | 'mentee' => {
    return role === 'mentor' || role === 'mentee';
  },
  
  // Error handling utilities
  getUnauthorizedMessage: (requiredRole: UserRole, currentRole: UserRole): string => {
    if (!currentRole) {
      return 'Please log in to access this feature.';
    }
    
    const requiredRoleName = roleUtils.getRoleDisplayName(requiredRole);
    const currentRoleName = roleUtils.getRoleDisplayName(currentRole);
    
    return `This feature requires ${requiredRoleName} access. You are currently logged in as a ${currentRoleName}.`;
  },
};

// Type guards
export const isUserRole = (value: unknown): value is UserRole => {
  return value === 'mentor' || value === 'mentee' || value === null;
};

export const isGroup = (value: unknown): value is Doc<'groups'> => {
  return typeof value === 'object' && 
         value !== null && 
         '_id' in value && 
         'name' in value;
};