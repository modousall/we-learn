import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCard } from './CourseCard';
import { UserProfile } from './UserProfile';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { ForumInterface } from '../forum/ForumInterface';
import { Leaderboard } from '../gamification/Leaderboard';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Bell, 
  LogOut,
  Star,
  Clock,
  Target,
  MessageSquare,
  Award,
  Globe
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

interface DashboardProps {
  user: User;
  onCourseSelect?: (courseId: string) => void;
  onViewChange?: (view: 'dashboard' | 'study-plan' | 'community' | 'analytics') => void;
}

export const Dashboard = ({ user, onCourseSelect, onViewChange }: DashboardProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');
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

  // Get the display name, showing the full_name if available
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/8aff2116-7caa-4844-ab1a-8bb8c8474859.png" 
                alt="We Learn Logo" 
                className="h-10 w-10 mr-3"
              />
              <h1 className="text-2xl font-bold text-gray-900">We Learn</h1>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => onViewChange?.('dashboard')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Accueil
              </button>
              <button 
                onClick={() => onViewChange?.('study-plan')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Plan d'Études
              </button>
              <button 
                onClick={() => onViewChange?.('community')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Communauté
              </button>
              <button 
                onClick={() => onViewChange?.('analytics')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Analyses
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
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
        {/* Welcome Section with enhanced design */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Bienvenue, {displayName}! 👋
              </h2>
              <p className="text-xl opacity-90 mb-4">
                Continuez votre parcours d'apprentissage et découvrez de nouveaux horizons.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="secondary" 
                  onClick={() => onViewChange?.('study-plan')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Mes Objectifs
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => onViewChange?.('community')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Rejoindre la Communauté
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-3xl font-bold">{getCompletedCourses()}</p>
                <p className="opacity-80">cours terminés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours Complétés</CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedCourses()}</div>
              <p className="text-xs opacity-80">
                sur {courses.length} cours disponibles
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps d'Étude</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(getTotalStudyTime() / 60)}h</div>
              <p className="text-xs opacity-80">
                {getTotalStudyTime() % 60}min cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Gagnés</CardTitle>
              <Star className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,890</div>
              <p className="text-xs opacity-80">
                +150 cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classement</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#8</div>
              <p className="text-xs opacity-80">
                Dans votre école
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs with enhanced design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 shadow-lg rounded-xl">
            <TabsTrigger value="courses" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4" />
              <span>Cours</span>
            </TabsTrigger>
            <TabsTrigger value="forum" className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4" />
              <span>Forum</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Trophy className="h-4 w-4" />
              <span>Classement</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Award className="h-4 w-4" />
              <span>Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Course Categories */}
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
                    if (onCourseSelect) {
                      onCourseSelect(course.id);
                    } else {
                      toast({
                        title: "Cours sélectionné !",
                        description: `Ouverture du cours: ${course.title}`,
                      });
                    }
                  }}
                />
              ))}
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
          </TabsContent>

          <TabsContent value="forum">
            <ForumInterface user={user} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="space-y-6">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Global
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Mon École
                </Button>
              </div>
              <Leaderboard userId={user.id} scope="global" />
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Mes Badges et Réalisations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Premier Cours Terminé</h3>
                    <p className="text-sm text-gray-600">Félicitations pour avoir terminé votre premier cours !</p>
                    <Badge className="mt-3">Débloqué</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Quiz Master</h3>
                    <p className="text-sm text-gray-600">Obtenez 100% à 5 quiz consécutifs</p>
                    <Progress value={60} className="mt-3" />
                    <p className="text-xs text-gray-500 mt-1">3/5 quiz réussis</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Régularité</h3>
                    <p className="text-sm text-gray-600">Étudiez 7 jours consécutifs</p>
                    <Progress value={85} className="mt-3" />
                    <p className="text-xs text-gray-500 mt-1">6/7 jours</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Prochains Badges à Débloquer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="font-medium">Mentor Communautaire</h4>
                          <p className="text-sm text-gray-600">Aidez 10 personnes sur le forum</p>
                        </div>
                      </div>
                      <Progress value={30} className="w-24" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Trophy className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="font-medium">Expert Finance</h4>
                          <p className="text-sm text-gray-600">Terminez tous les cours de finance</p>
                        </div>
                      </div>
                      <Progress value={75} className="w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        user={user} 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};
