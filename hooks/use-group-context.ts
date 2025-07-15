'use client';

import { useRole } from '@/components/providers/role-provider';
import { Doc, Id } from '@/convex/_generated/dataModel';

interface UseGroupContextReturn {
  currentGroup: Doc<'groups'> | null;
  availableGroups: Array<{
    group: Doc<'groups'> | null;
    role: 'mentor' | 'mentee';
    groupId: Id<'groups'>;
  }>;
  switchGroup: (groupId: Id<'groups'>) => void;
  hasMultipleGroups: boolean;
  canSwitchGroups: boolean;
  isGroupSelected: boolean;
}

export function useGroupContext(): UseGroupContextReturn {
  const { 
    currentGroup, 
    availableGroups, 
    switchGroup 
  } = useRole();
  
  const hasMultipleGroups = availableGroups.length > 1;
  const canSwitchGroups = availableGroups.length > 0;
  const isGroupSelected = currentGroup !== null;
  
  const groupsWithRoles = availableGroups.map(membership => ({
    group: membership.group,
    role: membership.role,
    groupId: membership.groupId,
  }));
  
  return {
    currentGroup,
    availableGroups: groupsWithRoles,
    switchGroup,
    hasMultipleGroups,
    canSwitchGroups,
    isGroupSelected,
  };
}