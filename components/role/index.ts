// Role-based rendering components
export { 
  RoleGuard, 
  MentorOnly, 
  MenteeOnly, 
  RoleSwitch 
} from './role-guard';

// Role display components
export { 
  RoleBadge, 
  UserRoleDisplay 
} from './role-badge';

// Role-aware interactive components
export { 
  RoleButton, 
  CreateButton, 
  EditButton, 
  DeleteButton 
} from './role-button';

// Re-export hooks for convenience
export { useRole, useIsMentor, useIsMentee, useCurrentGroup } from '@/components/providers/role-provider';
export { useRoleGuard } from '@/hooks/use-role-guard';
export { useGroupContext } from '@/hooks/use-group-context';
export { useRoleNavigation } from '@/hooks/use-role-navigation';

// Re-export utilities
export { roleUtils } from '@/lib/role-utils';