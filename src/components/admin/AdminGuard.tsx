
import React from 'react';
import { User } from '@supabase/supabase-js';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  user: User;
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'teacher';
}

export const AdminGuard = ({ user, children, requiredRole = 'admin' }: AdminGuardProps) => {
  const { role, loading, isAdmin, isModerator, isTeacher } = useUserRole(user);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  const hasAccess = () => {
    switch (requiredRole) {
      case 'admin':
        return isAdmin;
      case 'moderator':
        return isModerator || isAdmin;
      case 'teacher':
        return isTeacher || isModerator || isAdmin;
      default:
        return false;
    }
  };

  if (!hasAccess()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Accès Restreint
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">
                Votre rôle actuel : <span className="font-medium text-gray-700 capitalize">{role}</span>
              </p>
              <p className="text-sm text-gray-500">
                Rôle requis : <span className="font-medium text-gray-700 capitalize">{requiredRole}</span>
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
