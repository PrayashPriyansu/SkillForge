'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/components/providers/role-provider';
import { roleUtils } from '@/lib/role-utils';

interface RoleBadgeProps {
    /** Show role for specific user instead of current user */
    role?: 'mentor' | 'mentee' | null;
    /** Custom className */
    className?: string;
    /** Badge variant */
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function RoleBadge({
    role: propRole,
    className,
    variant = 'default'
}: RoleBadgeProps) {
    const { currentRole } = useRole();
    const role = propRole ?? currentRole;

    if (!role) return null;

    const displayName = roleUtils.getRoleDisplayName(role);
    const badgeVariant = role === 'mentor' ? 'default' : 'secondary';

    return (
        <Badge
            variant={variant === 'default' ? badgeVariant : variant}
            className={className}
        >
            {displayName}
        </Badge>
    );
}

// Component to show current user's role and group
export function UserRoleDisplay({ className }: { className?: string }) {
    const { currentRole, currentGroup, isLoading } = useRole();

    if (isLoading) {
        return (
            <div className={className}>
                <div className="animate-pulse bg-muted rounded h-6 w-20" />
            </div>
        );
    }

    if (!currentRole || !currentGroup) {
        return null;
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <RoleBadge />
            <span className="text-sm text-muted-foreground">
                in {currentGroup.name}
            </span>
        </div>
    );
}