
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Users } from 'lucide-react';

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
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz';
  content?: string;
  videoUrl?: string;
  questions?: QuizQuestion[];
  duration_minutes?: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points?: number;
}

interface UserProgress {
  progress_percentage: number;
  completed_modules: string[];
  current_module_index: number;
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
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
    loadProgress();
  }, [courseId, user]);

  const loadCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      
      // Safely parse the content JSON
      if (data) {
        const courseData: Course = {
          ...data,
          content: typeof data.content === 'string' 
            ? JSON.parse(data.content) 
            : data.content || { modules: [] }
        };
        setCourse(courseData);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (data) {
        setProgress(data.progress_percentage || 0);
        
        // Safely handle completed_modules Json type
        const completedModulesData = Array.isArray(data.completed_modules) 
          ? data.completed_modules.map(String) 
          : typeof data.completed_modules === 'string'
          ? JSON.parse(data.completed_modules)
          : [];
        
        setCompletedModules(completedModulesData);
        setCurrentModuleIndex(0); // Default to 0 since current_module_index doesn't exist in DB
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const updateProgress = async (moduleId: string, completed: boolean = true) => {
    if (!course) return;

    const newCompletedModules = completed 
      ? [...new Set([...completedModules, moduleId])]
      : completedModules.filter(id => id !== moduleId);

    const newProgress = (newCompletedModules.length / course.content.modules.length) * 100;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: newProgress,
          completed_modules: newCompletedModules,
          completed: newProgress === 100,
          last_accessed_at: new Date().toISOString()
        });

      if (error) throw error;

      setCompletedModules(newCompletedModules);
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleModuleComplete = () => {
    if (!course) return;
    const currentModule = course.content.modules[currentModuleIndex];
    updateProgress(currentModule.id);
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    handleModuleComplete();
    
    if (currentModuleIndex < course!.content.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const nextModule = () => {
    if (course && currentModuleIndex < course.content.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const previousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cours non trouvé</h2>
          <Button onClick={onClose}>Retour au tableau de bord</Button>
        </div>
      </div>
    );
  }

  const currentModule = course.content.modules[currentModuleIndex];
  const isModuleCompleted = completedModules.includes(currentModule.id);

  if (showQuiz && currentModule.type === 'quiz' && currentModule.questions) {
    return (
      <QuizInterface
        courseId={courseId}
        questions={currentModule.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          points: q.points || 1
        }))}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onClose} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{course.level}</Badge>
                  <Badge variant="outline">{course.category}</Badge>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration_minutes} min
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{Math.round(progress)}% terminé</div>
              <Progress value={progress} className="w-32 mt-1" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentModule.title}</span>
                  {isModuleCompleted && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Terminé
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentModule.type === 'text' && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {currentModule.content}
                    </div>
                  </div>
                )}

                {currentModule.type === 'video' && (
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4" />
                      <p>Lecteur vidéo à intégrer</p>
                      <p className="text-sm opacity-75">{currentModule.videoUrl}</p>
                    </div>
                  </div>
                )}

                {currentModule.type === 'quiz' && (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Quiz d'évaluation</h3>
                    <p className="text-gray-600 mb-6">
                      Testez vos connaissances avec {currentModule.questions?.length} questions
                    </p>
                    <Button onClick={() => setShowQuiz(true)} size="lg">
                      Commencer le Quiz
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={previousModule}
                    disabled={currentModuleIndex === 0}
                  >
                    Module Précédent
                  </Button>

                  <div className="flex space-x-2">
                    {!isModuleCompleted && currentModule.type !== 'quiz' && (
                      <Button onClick={handleModuleComplete}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminé
                      </Button>
                    )}
                    
                    <Button 
                      onClick={nextModule}
                      disabled={currentModuleIndex === course.content.modules.length - 1}
                    >
                      Module Suivant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Modules du cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.content.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentModuleIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentModuleIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{module.title}</div>
                        <div className="text-xs text-gray-500 capitalize">{module.type}</div>
                      </div>
                      {completedModules.includes(module.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{course.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{course.content.modules.length} modules</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Niveau {course.level}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
