import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface UserPermissions {
  id: number;
  userId: number;
  canManageUsers: boolean;
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canExportData: boolean;
  canViewFinancials: boolean;
  canEditFinancials: boolean;
  canManageSubscriptions: boolean;
  role: 'administrator' | 'manager' | 'user' | string;
  createdAt: string;
  updatedAt: string;
}

export const defaultPermissions: UserPermissions = {
  id: 0,
  userId: 0,
  canManageUsers: false,
  canCreateProjects: true,
  canEditProjects: true,
  canDeleteProjects: false,
  canExportData: true,
  canViewFinancials: false,
  canEditFinancials: false,
  canManageSubscriptions: false,
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Berechtigungen vom Server abrufen
  const { data, isLoading, isError } = useQuery<UserPermissions>({
    queryKey: ['/api/user/permissions'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 Minuten Cache
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (isError) {
      setError('Fehler beim Laden der Berechtigungen');
      setLoading(false);
      return;
    }

    if (data) {
      setPermissions(data);
      setIsAdmin(data.role === 'administrator');
      setIsManager(data.role === 'manager');
      setIsUser(data.role === 'user');
    }
    
    setLoading(false);
  }, [data, isLoading, isError]);

  // Hilfsfunktion zur Überprüfung einer beliebigen Berechtigung
  const checkPermission = (permission: keyof UserPermissions): boolean => {
    if (isAdmin) return true; // Administratoren haben alle Berechtigungen
    
    // Prüfen, ob die Berechtigung eine boolesche Variable ist
    if (typeof permissions[permission] === 'boolean') {
      return permissions[permission] as boolean;
    }
    
    return false;
  };

  // Hilfsfunktion zur Überprüfung einer Rollenebene
  const hasRole = (minimumRole: 'administrator' | 'manager' | 'user'): boolean => {
    switch (minimumRole) {
      case 'administrator':
        return isAdmin;
      case 'manager':
        return isAdmin || isManager;
      case 'user':
        return isAdmin || isManager || isUser;
      default:
        return false;
    }
  };

  return {
    permissions,
    isAdmin,
    isManager,
    isUser,
    loading,
    error,
    checkPermission,
    hasRole
  };
};

// HOC für die rollenbasierte Zugangsbeschränkung
export const PermissionGate: React.FC<{
  permission?: keyof UserPermissions;
  requiredRole?: 'administrator' | 'manager' | 'user';
  children: React.ReactNode;
}> = ({ permission, requiredRole = 'user', children }) => {
  const { checkPermission, hasRole, loading } = usePermissions();

  if (loading) {
    return null;
  }

  if (permission && !checkPermission(permission)) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
};