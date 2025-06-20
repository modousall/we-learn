
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap } from 'lucide-react';

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    user_type: 'student',
    school_level: '',
    region: '',
    school_name: '',
    language_preference: 'fr'
  });
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.full_name,
            user_type: formData.user_type,
            school_level: formData.school_level,
            region: formData.region,
            school_name: formData.school_name,
            language_preference: formData.language_preference
          }
        }
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Inscription réussie !",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue sur WL (We Learn) 🎉",
        });
      }
    } catch (error) {
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            WL - We Learn
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Créer votre compte' : 'Connectez-vous à votre compte'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    placeholder="Votre nom complet"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_type">Type d'utilisateur</Label>
                  <Select
                    value={formData.user_type}
                    onValueChange={(value) => setFormData({...formData, user_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Élève/Étudiant</SelectItem>
                      <SelectItem value="parent">Parent/Tuteur</SelectItem>
                      <SelectItem value="teacher">Enseignant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.user_type === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="school_level">Niveau scolaire</Label>
                    <Select
                      value={formData.school_level}
                      onValueChange={(value) => setFormData({...formData, school_level: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primaire">Primaire</SelectItem>
                        <SelectItem value="college">Collège</SelectItem>
                        <SelectItem value="lycee">Lycée</SelectItem>
                        <SelectItem value="universite">Université</SelectItem>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Input
                    id="region"
                    placeholder="Votre région"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Langue préférée</Label>
                  <Select
                    value={formData.language_preference}
                    onValueChange={(value) => setFormData({...formData, language_preference: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="wo">Wolof</SelectItem>
                      <SelectItem value="bm">Bambara</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? 'Créer mon compte' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignUp 
                ? 'Déjà un compte ? Se connecter' 
                : 'Pas de compte ? Créer un compte'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
