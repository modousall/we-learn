import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, Clock, BookOpen, Trophy, Plus, ArrowLeft } from 'lucide-react';

interface StudyPlanProps {
  user: User;
  onBack?: () => void;
}

export const StudyPlan = ({ user, onBack }: StudyPlanProps) => {
  const [goals, setGoals] = useState<any[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudyPlan();
  }, [user]);

  const loadStudyPlan = async () => {
    try {
      // Mock data pour la démonstration
      setGoals([
        { id: 1, title: 'Maîtriser les Cryptomonnaies', progress: 75, deadline: '2024-02-15', priority: 'high' },
        { id: 2, title: 'Comprendre la DeFi', progress: 40, deadline: '2024-03-01', priority: 'medium' },
        { id: 3, title: 'Analyse Technique', progress: 90, deadline: '2024-01-30', priority: 'high' }
      ]);

      setWeeklyPlan([
        { day: 'Lundi', courses: ['Introduction Bitcoin', 'Blockchain Basics'], hours: 2 },
        { day: 'Mardi', courses: ['DeFi Fundamentals'], hours: 1.5 },
        { day: 'Mercredi', courses: ['Trading Strategies'], hours: 2.5 },
        { day: 'Jeudi', courses: ['Risk Management'], hours: 1 },
        { day: 'Vendredi', courses: ['Portfolio Analysis'], hours: 2 },
        { day: 'Samedi', courses: ['Market Research'], hours: 3 },
        { day: 'Dimanche', courses: ['Review & Practice'], hours: 1.5 }
      ]);
    } catch (error) {
      console.error('Error loading study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}
              <img 
                src="/lovable-uploads/8aff2116-7caa-4844-ab1a-8bb8c8474859.png" 
                alt="We Learn Logo" 
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-bold text-gray-900">Plan d'Études Personnel</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Objectif
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        
        {/* Objectifs d'apprentissage */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Mes Objectifs d'Apprentissage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'}>
                      {goal.priority === 'high' ? 'Priorité' : 'Normal'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{goal.deadline}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Voir Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Planning hebdomadaire */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Planning de la Semaine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {weeklyPlan.map((day, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-center text-lg">{day.day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="text-sm font-medium">{day.hours}h</span>
                    </div>
                    <div className="space-y-1">
                      {day.courses.map((course: string, courseIndex: number) => (
                        <div key={courseIndex} className="text-xs bg-blue-50 p-2 rounded text-center">
                          {course}
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistiques de progression */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heures cette semaine</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13.5h</div>
              <p className="text-xs text-muted-foreground">+2.5h vs semaine dernière</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs atteints</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2/3</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours complétés</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% ce mois</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
