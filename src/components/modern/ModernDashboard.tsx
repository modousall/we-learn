import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Header } from './Header';
import { CategoryTabs } from './CategoryTabs';
import { VideoCard } from './VideoCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { useUserRole } from '@/hooks/useUserRole';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  Settings,
  Users
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
  thumbnail_url: string;
  video_url: string;
}

interface ModernDashboardProps {
  user: User;
}

export const ModernDashboard = ({ user }: ModernDashboardProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBackoffice, setShowBackoffice] = useState(false);
  const { isAdmin, isTeacher, loading: roleLoading } = useUserRole(user);
  const { toast } = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, searchTerm]);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
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

  if (showBackoffice && (isAdmin || isTeacher)) {
    return (
      <AdminGuard user={user} requiredRole="teacher">
        <AdminDashboard user={user} />
      </AdminGuard>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Admin Access Button */}
        {!roleLoading && (isAdmin || isTeacher) && (
          <div className="mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">
                        Accès Administrateur
                      </h3>
                      <p className="text-sm text-blue-700">
                        Gérez les cours, utilisateurs et paramètres de la plateforme
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowBackoffice(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Backoffice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur WeLearn ! 👋
          </h1>
          <p className="text-gray-600">
            Découvrez nos cours et développez vos compétences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours Disponibles</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                Dans toutes les catégories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progression</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Commencez votre apprentissage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                À débloquer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps d'étude</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h</div>
              <p className="text-xs text-muted-foreground">
                Cette semaine
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Categories and Search */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `Aucun cours ne correspond à "${searchTerm}"`
                : selectedCategory !== 'all' 
                  ? `Aucun cours dans la catégorie sélectionnée`
                  : 'Aucun cours disponible pour le moment'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <VideoCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
