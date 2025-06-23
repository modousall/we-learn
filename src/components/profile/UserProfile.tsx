
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Mail, MapPin, School, Globe } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  school_level: string;
  region: string;
  language_preference: string;
  role: string;
}

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    region: '',
    school_level: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        region: data.region || '',
        school_level: data.school_level || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès"
      });
      
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      'admin': 'Administrateur',
      'teacher': 'Enseignant',
      'moderator': 'Modérateur',
      'student': 'Étudiant'
    };
    return roleMap[role as keyof typeof roleMap] || 'Étudiant';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-500 text-white text-2xl">
                {getInitials(profile?.full_name || '')}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{profile?.full_name || 'Utilisateur'}</CardTitle>
          <p className="text-gray-600">{getRoleDisplay(profile?.role || 'student')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span>{profile?.email}</span>
          </div>
          
          {profile?.region && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{profile.region}</span>
            </div>
          )}
          
          {profile?.school_level && (
            <div className="flex items-center space-x-3">
              <School className="h-5 w-5 text-gray-400" />
              <span>{profile.school_level}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <span>{profile?.language_preference === 'fr' ? 'Français' : 'Anglais'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Informations personnelles
            <Button
              variant="outline"
              onClick={() => editing ? updateProfile() : setEditing(true)}
            >
              {editing ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              disabled={!editing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              disabled={!editing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="school_level">Niveau scolaire</Label>
            <Input
              id="school_level"
              value={formData.school_level}
              onChange={(e) => setFormData({...formData, school_level: e.target.value})}
              disabled={!editing}
            />
          </div>
          
          {editing && (
            <div className="flex space-x-2">
              <Button onClick={updateProfile}>Sauvegarder</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Annuler
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
