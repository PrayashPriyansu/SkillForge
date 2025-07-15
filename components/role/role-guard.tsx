'use client';

import React from 'react';
import { useRole } from '@/components/providers/role-provider';
import { roleUtils } from '@/lib/role-utils';

interface RoleGuardProps {
    /** Required role to show content */
    role?: 'mentor' | 'mentee';
    /** Array of allowed roles */
    roles?: ('mentor' | 'mentee')[];
    /** Content to show when role doesn't match */
    fallback?: React.ReactNode;
    /** Whether to show content when loading */
    showWhenLoading?: boolean;
    /** Whether to show content when no role is determined */
    showWhenNoRole?: boolean;
    /** Children to render when role matches */
    children: React.ReactNode;
}

export function RoleGuard({
    role,
    roles,
    fallback = null,
    showWhenLoading = false,
    showWhenNoRole = false,
    children,
}: RoleGuardProps) {
    const { currentRole, isLoading } = useRole();

    // Show loading state if specified
    if (isLoading && showWhenLoading) {
        return <>{children}</>;
    }

    // Don't render anything while loading unless specified
    if (isLoading) {
        return <>{fallback}</>;
    }

    // Handle no role case
    if (!currentRole && !showWhenNoRole) {
        return <>{fallback}</>;
    }

    // Check single role
    if (role && currentRole !== role) {
        return <>{fallback}</>;
    }

    // Check multiple roles
    if (roles && roles.length > 0 && !roles.includes(currentRole!)) {
        return <>{fallback}</>;
    }

    // Role matches, render children
    return <>{children}</>;
}

// Convenience components for specific roles
export function MentorOnly({
    children,
    fallback = null
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    return (
        <RoleGuard role="mentor" fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

export function MenteeOnly({
    children,
    fallback = null
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    return (
        <RoleGuard role="mentee" fallback={fallback}>
            {children}
        </RoleGuard>
    );
}

// Component for showing different content based on role
interface RoleSwitchProps {
    mentor?: React.ReactNode;
    mentee?: React.ReactNode;
    fallback?: React.ReactNode;
    loading?: React.ReactNode;
}

export function RoleSwitch({
    mentor,
    mentee,
    fallback = null,
    loading = null
}: RoleSwitchProps) {
    const { currentRole, isLoading } = useRole();

    if (isLoading) {
        return <>{loading || fallback}</>;
    }

    switch (currentRole) {
        case 'mentor':
            return <>{mentor || fallback}</>;
        case 'mentee':
            return <>{mentee || fallback}</>;
        default:
            return <>{fallback}</>;
    }
}