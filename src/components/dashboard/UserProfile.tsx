
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon, Settings, CreditCard, HelpCircle } from 'lucide-react';

interface UserProfileProps {
  user: User;
  profile: any;
}

export const UserProfile = ({ user, profile }: UserProfileProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user.email} />
            <AvatarFallback>
              {profile?.full_name ? getInitials(profile.full_name) : <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || 'Utilisateur'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {profile?.user_type && (
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {profile.user_type === 'student' ? 'Élève' : 
                 profile.user_type === 'parent' ? 'Parent' : 
                 profile.user_type === 'teacher' ? 'Enseignant' : 'Admin'}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Abonnement</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
