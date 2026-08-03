'use client';

import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { ExtendedRole, PermissionCategory } from '@/types/phase2';
import { ShieldAlert } from 'lucide-react';

interface PermissionGuardProps {
  requiredRole?: ExtendedRole;
  category?: PermissionCategory;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredRole = 'EMPLOYEE',
  fallback,
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      fallback || (
        <div className="p-8 text-center glass-card rounded-3xl border border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Authentication Required</h3>
          <p className="text-xs text-slate-400">Please sign in to access this enterprise platform view.</p>
        </div>
      )
    );
  }

  // Super Admin overrides all checks
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return <>{children}</>;
  }

  // Check required role hierarchy
  const roleHierarchy: ExtendedRole[] = ['GUEST', 'CLIENT', 'EMPLOYEE', 'TEAM_LEAD', 'MANAGER', 'HR', 'ADMIN', 'SUPER_ADMIN'];
  const userRoleIndex = roleHierarchy.indexOf(user.role as any);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  if (userRoleIndex < requiredRoleIndex) {
    return (
      fallback || (
        <div className="p-8 text-center glass-card rounded-3xl border border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Access Restricted (RBAC)</h3>
          <p className="text-xs text-slate-400">
            Your current role (<strong className="text-amber-300">{user.role}</strong>) does not have sufficient permissions to view this module.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
};
