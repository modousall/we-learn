
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from './CourseCard';
import { UserProfile } from './UserProfile';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Bell, 
  LogOut,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_minutes: number;
  is_premium: boolean;
  price_fcfa: number;
  thumbnail_url?: string;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  time_spent_minutes: number;
}

export const Dashboard = ({ user }: { user: User }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Load user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;
      setUserProgress(progressData || []);

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive"
      });
    }
  };

  const getProgressForCourse = (courseId: string) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    return progress ? progress.progress_percentage : 0;
  };

  const getTotalStudyTime = () => {
    return userProgress.reduce((total, progress) => total + progress.time_spent_minutes, 0);
  };

  const getCompletedCourses = () => {
    return userProgress.filter(p => p.progress_percentage === 100).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">WL - We Learn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <UserProfile user={user} profile={profile} />
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {profile?.full_name || user.email}! 👋
          </h2>
          <p className="text-gray-600">
            Continuez votre parcours d'apprentissage et découvrez de nouveaux cours.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours Complétés</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedCourses()}</div>
              <p className="text-xs text-muted-foreground">
                sur {courses.length} cours disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps d'Étude</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(getTotalStudyTime() / 60)}h</div>
              <p className="text-xs text-muted-foreground">
                {getTotalStudyTime() % 60}min cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {profile?.school_level || 'Débutant'}
              </div>
              <p className="text-xs text-muted-foreground">
                Continuez à apprendre !
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Cours Disponibles</h3>
            <div className="flex space-x-2">
              <Badge variant="secondary">Finance</Badge>
              <Badge variant="secondary">Technologie</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getProgressForCourse(course.id)}
                onEnroll={() => {
                  toast({
                    title: "Cours ajouté !",
                    description: `Vous avez rejoint le cours: ${course.title}`,
                  });
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Rejoindre une Classe
              </CardTitle>
              <CardDescription>
                Entrez le code de classe pour rejoindre une classe virtuelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Code de classe"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button>Rejoindre</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Défis du Jour
              </CardTitle>
              <CardDescription>
                Participez aux défis quotidiens pour gagner des points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Voir les Défis</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
