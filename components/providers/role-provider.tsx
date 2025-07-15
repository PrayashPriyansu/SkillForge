'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useGlobalStore } from './store-provider';

interface GroupMembership {
    _id: Id<'groupMemberships'>;
    userId: Id<'users'>;
    groupId: Id<'groups'>;
    role: 'mentor' | 'mentee';
    status: 'active' | 'removed' | 'left' | 'pending';
    group: Doc<'groups'> | null;
}

interface RoleContextType {
    // Current role and group
    currentRole: 'mentor' | 'mentee' | null;
    currentGroup: Doc<'groups'> | null;

    // Available groups and memberships
    availableGroups: GroupMembership[];

    // Role checking utilities
    isMentor: boolean;
    isMentee: boolean;

    // Group switching
    switchGroup: (groupId: Id<'groups'>) => void;

    // Loading and error states
    isLoading: boolean;
    error: string | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
    children: React.ReactNode;
}

export function RoleProvider({ children }: RoleProviderProps) {
    const [error, setError] = useState<string | null>(null);

    // Get current group from global store
    const currGroup = useGlobalStore((state) => state.currGroup);
    const setGroup = useGlobalStore((state) => state.setGroup);
    const setIsMentor = useGlobalStore((state) => state.setIsMentor);

    // Temporary fallback: use existing global store until Convex functions are deployed
    const globalIsMentor = useGlobalStore((state) => state.isMentor);

    // For now, create mock data based on existing global store
    const memberships: GroupMembership[] = currGroup ? [{
        _id: 'temp' as Id<'groupMemberships'>,
        userId: 'temp' as Id<'users'>,
        groupId: currGroup._id,
        role: globalIsMentor ? 'mentor' : 'mentee',
        status: 'active',
        group: currGroup,
    }] : [];

    const isLoading = false;

    // Determine current role from global store
    const currentRole = globalIsMentor ? 'mentor' : 'mentee';

    // Role checking utilities
    const isMentor = currentRole === 'mentor';
    const isMentee = currentRole === 'mentee';

    // Update global store when role changes
    useEffect(() => {
        setIsMentor(isMentor);
    }, [isMentor, setIsMentor]);

    // Auto-select first group if no group is selected
    useEffect(() => {
        if (memberships && memberships.length > 0 && !currGroup?._id) {
            const firstGroup = memberships[0].group;
            if (firstGroup) {
                setGroup(firstGroup);
            }
        }
    }, [memberships, currGroup, setGroup]);

    const switchGroup = (groupId: Id<'groups'>) => {
        try {
            const membership = memberships?.find(m => m.groupId === groupId);
            if (membership?.group) {
                setGroup(membership.group);
                setError(null);
            } else {
                setError('Group not found or access denied');
            }
        } catch (err) {
            setError('Failed to switch group');
            console.error('Group switching error:', err);
        }
    };

    const contextValue: RoleContextType = {
        currentRole,
        currentGroup: currGroup,
        availableGroups: memberships || [],
        isMentor,
        isMentee,
        switchGroup,
        isLoading,
        error,
    };

    return (
        <RoleContext.Provider value={contextValue}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole(): RoleContextType {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}

// Convenience hooks for common role checks
export function useIsMentor(): boolean {
    const { isMentor } = useRole();
    return isMentor;
}

export function useIsMentee(): boolean {
    const { isMentee } = useRole();
    return isMentee;
}

export function useCurrentGroup(): Doc<'groups'> | null {
    const { currentGroup } = useRole();
    return currentGroup;
}