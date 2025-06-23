
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, UserCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/hooks/useUserRole';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export const RoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUpdating(userId);
    try {
      // Supprimer l'ancien rôle
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Ajouter le nouveau rôle
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: userId,
          role: newRole
        }]);

      if (error) throw error;

      toast({
        title: "Rôle mis à jour",
        description: `Le rôle a été changé vers ${getRoleLabel(newRole)}`,
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'moderator': return 'Modérateur';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Élève';
      default: return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-orange-100 text-orange-800';
      case 'teacher': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Gestion des Rôles ({users.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{user.full_name || 'Nom non renseigné'}</h3>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Élève</SelectItem>
                      <SelectItem value="teacher">Enseignant</SelectItem>
                      <SelectItem value="moderator">Modérateur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {updating === user.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Important :</p>
              <p className="text-yellow-700">
                Soyez prudent lors de la modification des rôles. Les administrateurs ont un accès complet à la plateforme.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
