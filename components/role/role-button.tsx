'use client';

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useRole } from '@/components/providers/role-provider';
import { roleUtils } from '@/lib/role-utils';

interface RoleButtonProps extends ButtonProps {
    /** Required role to enable the button */
    requiredRole?: 'mentor' | 'mentee';
    /** Array of allowed roles */
    allowedRoles?: ('mentor' | 'mentee')[];
    /** What to do when role doesn't match: hide, disable, or show with different style */
    unauthorizedBehavior?: 'hide' | 'disable' | 'show';
    /** Custom unauthorized message for tooltip */
    unauthorizedMessage?: string;
    /** Show button when loading */
    showWhenLoading?: boolean;
}

export function RoleButton({
    requiredRole,
    allowedRoles,
    unauthorizedBehavior = 'hide',
    unauthorizedMessage,
    showWhenLoading = false,
    children,
    disabled,
    onClick,
    ...props
}: RoleButtonProps) {
    const { currentRole, isLoading } = useRole();

    // Handle loading state
    if (isLoading && !showWhenLoading) {
        return null;
    }

    // Check if user has required permissions
    const hasPermission = (() => {
        if (!currentRole) return false;

        if (requiredRole) {
            return currentRole === requiredRole;
        }

        if (allowedRoles && allowedRoles.length > 0) {
            return allowedRoles.includes(currentRole);
        }

        // No role restrictions
        return true;
    })();

    // Handle unauthorized access
    if (!hasPermission) {
        switch (unauthorizedBehavior) {
            case 'hide':
                return null;

            case 'disable':
                return (
                    <Button
                        {...props}
                        disabled={true}
                        title={unauthorizedMessage || roleUtils.getUnauthorizedMessage(requiredRole!, currentRole)}
                    >
                        {children}
                    </Button>
                );

            case 'show':
                return (
                    <Button
                        {...props}
                        variant="outline"
                        disabled={disabled}
                        onClick={onClick}
                        title={unauthorizedMessage || 'Limited access based on your role'}
                    >
                        {children}
                    </Button>
                );
        }
    }

    // User has permission, render normal button
    return (
        <Button
            {...props}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

// Convenience components for common actions
export function CreateButton(props: Omit<RoleButtonProps, 'requiredRole'>) {
    return (
        <RoleButton
            requiredRole="mentor"
            unauthorizedBehavior="hide"
            {...props}
        />
    );
}

export function EditButton(props: Omit<RoleButtonProps, 'requiredRole'>) {
    return (
        <RoleButton
            requiredRole="mentor"
            unauthorizedBehavior="hide"
            {...props}
        />
    );
}

export function DeleteButton(props: Omit<RoleButtonProps, 'requiredRole'>) {
    return (
        <RoleButton
            requiredRole="mentor"
            unauthorizedBehavior="hide"
            variant="destructive"
            {...props}
        />
    );
}