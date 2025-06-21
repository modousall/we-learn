
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuizInterface } from '../quiz/QuizInterface';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle, 
  Lock,
  BookOpen,
  Video,
  FileText,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  duration?: number;
  video_url?: string;
  quiz_questions?: any[];
}

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
  content: {
    modules: Module[];
  };
}

interface CourseViewerProps {
  courseId: string;
  user: User;
  onClose: () => void;
}

export const CourseViewer = ({ courseId, user, onClose }: CourseViewerProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadCourse();
    loadProgress();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      
      // Type assertion with proper content structure
      const courseData: Course = {
        ...data,
        content: typeof data.content === 'string' 
          ? JSON.parse(data.content) 
          : data.content || { modules: [] }
      };
      
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le cours",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (data) {
        // Safe parsing of completed_modules
        let completedModulesData: number[] = [];
        if (data.completed_modules) {
          if (typeof data.completed_modules === 'string') {
            try {
              completedModulesData = JSON.parse(data.completed_modules);
            } catch (e) {
              completedModulesData = [];
            }
          } else if (Array.isArray(data.completed_modules)) {
            completedModulesData = data.completed_modules;
          }
        }
        
        setCompletedModules(completedModulesData);
        setProgress(data.progress_percentage || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const markModuleComplete = async (moduleIndex: number) => {
    if (completedModules.includes(moduleIndex)) return;

    const newCompleted = [...completedModules, moduleIndex];
    const newProgress = Math.round((newCompleted.length / (course?.content.modules.length || 1)) * 100);

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: newProgress,
          completed_modules: JSON.stringify(newCompleted),
          last_accessed_at: new Date().toISOString()
        });

      if (error) throw error;

      setCompletedModules(newCompleted);
      setProgress(newProgress);

      toast({
        title: "Module terminé !",
        description: `Vous avez gagné 50 points ! Progression: ${newProgress}%`,
      });

      if (newProgress === 100) {
        toast({
          title: "🎉 Cours terminé !",
          description: "Félicitations ! Vous pouvez maintenant télécharger votre certificat.",
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Cours introuvable</h3>
            <p className="text-gray-600 mb-4">Le cours demandé n'existe pas.</p>
            <Button onClick={onClose}>Retour</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentModuleData = course.content.modules[currentModule];
  const isModuleCompleted = completedModules.includes(currentModule);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{course.title}</h1>
                <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={course.is_premium ? "default" : "secondary"}>
                {course.is_premium ? "Premium" : "Gratuit"}
              </Badge>
              <Progress value={progress} className="w-32" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modules du Cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.content.modules.map((module, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentModule(index)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      currentModule === index
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {module.type === 'video' && <Video className="h-4 w-4 text-blue-500" />}
                        {module.type === 'text' && <FileText className="h-4 w-4 text-green-500" />}
                        {module.type === 'quiz' && <BookOpen className="h-4 w-4 text-purple-500" />}
                        <span className="text-sm font-medium">{module.title}</span>
                      </div>
                      {completedModules.includes(index) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{currentModuleData?.title}</CardTitle>
                  {isModuleCompleted && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Terminé
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {currentModuleData?.type === 'video' && (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      {currentModuleData.video_url ? (
                        <video
                          controls
                          className="w-full h-full rounded-lg"
                          src={currentModuleData.video_url}
                        />
                      ) : (
                        <div className="text-center text-white">
                          <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Vidéo en cours de préparation</p>
                        </div>
                      )}
                    </div>
                    <div className="prose max-w-none">
                      <p>{currentModuleData.content}</p>
                    </div>
                  </div>
                )}

                {currentModuleData?.type === 'text' && (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: currentModuleData.content }} />
                  </div>
                )}

                {currentModuleData?.type === 'quiz' && currentModuleData.quiz_questions && (
                  <QuizInterface
                    questions={currentModuleData.quiz_questions.map((q: any) => ({
                      id: q.id || Math.random().toString(),
                      question: q.question,
                      options: q.options,
                      correctAnswer: q.correct_answer || q.correctAnswer,
                      explanation: q.explanation,
                      points: q.points || 10
                    }))}
                    onComplete={(score) => {
                      toast({
                        title: "Quiz terminé !",
                        description: `Score: ${score}%`,
                      });
                      markModuleComplete(currentModule);
                    }}
                  />
                )}

                {/* Module Navigation */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
                    disabled={currentModule === 0}
                  >
                    Module précédent
                  </Button>

                  <div className="flex space-x-2">
                    {!isModuleCompleted && currentModuleData?.type !== 'quiz' && (
                      <Button onClick={() => markModuleComplete(currentModule)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => setCurrentModule(Math.min(course.content.modules.length - 1, currentModule + 1))}
                      disabled={currentModule === course.content.modules.length - 1}
                    >
                      Module suivant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
