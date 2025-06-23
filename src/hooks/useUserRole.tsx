
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'teacher' | 'student';

interface UserRoleData {
  role: UserRole | null;
  isAdmin: boolean;
  isTeacher: boolean;
  isModerator: boolean;
  loading: boolean;
}

export const useUserRole = (user: User | null): UserRoleData => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          return;
        }

        setRole(data?.role || 'student');
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setRole('student');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    role,
    isAdmin: role === 'admin',
    isTeacher: role === 'teacher' || role === 'admin',
    isModerator: role === 'moderator' || role === 'admin',
    loading
  };
};
