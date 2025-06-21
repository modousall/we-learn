
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuizInterface } from '../quiz/QuizInterface';
import { CertificateGenerator } from '../certificate/CertificateGenerator';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  BookOpen, 
  CheckCircle, 
  Lock,
  Award,
  Volume2,
  Download
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
  content: {
    modules: Module[];
  };
}

interface Module {
  title: string;
  content: string;
  type: 'text' | 'video' | 'audio' | 'quiz';
  video_url?: string;
  audio_url?: string;
  questions?: QuizQuestion[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface CourseViewerProps {
  courseId: string;
  user: User;
  onClose: () => void;
}

export const CourseViewer = ({ courseId, user, onClose }: CourseViewerProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCourse();
    loadUserProgress();
  }, [courseId, user.id]);

  const loadCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
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

  const loadUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (data) {
        setProgress(data.progress_percentage);
        setCompletedModules(data.completed_modules || []);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const updateProgress = async (moduleIndex: number) => {
    try {
      const newCompletedModules = [...completedModules];
      if (!newCompletedModules.includes(moduleIndex)) {
        newCompletedModules.push(moduleIndex);
      }

      const newProgress = Math.round((newCompletedModules.length / (course?.content?.modules?.length || 1)) * 100);

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: newProgress,
          completed_modules: newCompletedModules,
          last_accessed_at: new Date().toISOString()
        });

      if (error) throw error;

      setCompletedModules(newCompletedModules);
      setProgress(newProgress);

      if (newProgress === 100) {
        setShowCertificate(true);
        
        // Add achievement
        await supabase
          .from('achievements')
          .insert({
            user_id: user.id,
            title: 'Cours Terminé',
            description: `Félicitations ! Vous avez terminé le cours "${course?.title}"`,
            badge_type: 'completion',
            course_id: courseId
          });

        toast({
          title: "Félicitations ! 🎉",
          description: "Vous avez terminé ce cours avec succès !",
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleModuleComplete = () => {
    updateProgress(currentModuleIndex);
    
    if (currentModule?.type === 'quiz') {
      setShowQuiz(true);
    } else {
      // Auto-advance to next module
      if (currentModuleIndex < (course?.content?.modules?.length || 0) - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
      }
    }
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    
    // Save quiz score
    toast({
      title: "Quiz terminé !",
      description: `Votre score: ${score}%`,
    });

    // Move to next module
    if (currentModuleIndex < (course?.content?.modules?.length || 0) - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const downloadOfflineContent = async () => {
    // In a real app, this would download content for offline viewing
    toast({
      title: "Téléchargement lancé",
      description: "Le contenu sera disponible hors ligne",
    });
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
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Cours non trouvé</h2>
            <p className="text-gray-600 mb-4">Le cours demandé n'existe pas ou n'est plus disponible.</p>
            <Button onClick={onClose}>Retour</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentModule = course.content?.modules?.[currentModuleIndex];
  const isModuleCompleted = completedModules.includes(currentModuleIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onClose}>
                ← Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold">{course.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  {course.is_premium && (
                    <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={downloadOfflineContent}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progression</p>
                <p className="font-bold">{progress}%</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{currentModule?.title}</span>
                  </div>
                  {isModuleCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentModule?.type === 'video' && currentModule.video_url && (
                  <div className="mb-6">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <Button
                        size="lg"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-white/20 hover:bg-white/30"
                      >
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </Button>
                    </div>
                  </div>
                )}

                {currentModule?.type === 'audio' && currentModule.audio_url && (
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Button
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm">Audio du cours</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {currentModule?.content}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))}
                    disabled={currentModuleIndex === 0}
                  >
                    <SkipBack className="h-4 w-4 mr-2" />
                    Précédent
                  </Button>

                  <Button onClick={handleModuleComplete}>
                    {currentModule?.type === 'quiz' ? 'Commencer le Quiz' : 'Module Terminé'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentModuleIndex(Math.min((course.content?.modules?.length || 1) - 1, currentModuleIndex + 1))}
                    disabled={currentModuleIndex === (course.content?.modules?.length || 1) - 1}
                  >
                    Suivant
                    <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modules du Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.content?.modules?.map((module, index) => {
                    const isCompleted = completedModules.includes(index);
                    const isCurrent = index === currentModuleIndex;
                    
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isCurrent 
                            ? 'bg-blue-50 border-blue-200' 
                            : isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => setCurrentModuleIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{module.title}</p>
                            <p className="text-xs text-gray-600 capitalize">{module.type}</p>
                          </div>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {!isCompleted && index > currentModuleIndex && (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {progress === 100 && (
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      className="w-full"
                      onClick={() => setShowCertificate(true)}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Voir Certificat
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentModule?.questions && (
        <QuizInterface
          questions={currentModule.questions}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateGenerator
          certificateData={{
            studentName: user.user_metadata?.full_name || user.email || 'Étudiant',
            courseName: course.title,
            completionDate: new Date().toISOString(),
            score: 85, // Mock score
            duration: `${course.duration_minutes} minutes`,
            certificateId: `WL-${courseId.slice(0, 8).toUpperCase()}`
          }}
          onDownload={() => {
            toast({
              title: "Certificat téléchargé !",
              description: "Votre certificat a été téléchargé avec succès.",
            });
            setShowCertificate(false);
          }}
        />
      )}
    </div>
  );
};
