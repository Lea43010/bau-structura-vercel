import { useAuth } from './use-auth';

type Role = 'administrator' | 'manager' | 'user' | 'benutzer';

export function usePermission() {
  const { user } = useAuth();

  const canView = (requiredRoles: Role | Role[]): boolean => {
    if (!user) {
      console.log('PermissionGate: No user found');
      return false;
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = user.role;

    // Debug-Ausgabe für Admin-Bereiche
    if (roles.includes('administrator')) {
      console.log('PermissionGate check:', {
        userRole,
        requiredRoles,
        user: user.username
      });
    }

    // Überprüfe, ob der Benutzer eine der erforderlichen Rollen hat
    const hasPermission = roles.some(role => {
      // Normalisiere Rollennamen (benutzer -> user)
      const normalizedRole = role === 'benutzer' ? 'user' : role;
      const normalizedUserRole = userRole === 'benutzer' ? 'user' : userRole;
      
      return normalizedUserRole === normalizedRole;
    });

    // Debug-Ausgabe für Admin-Bereiche
    if (roles.includes('administrator')) {
      console.log('PermissionGate result:', hasPermission);
    }

    return hasPermission;
  };

  return { canView };
}