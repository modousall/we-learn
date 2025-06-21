
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, TrendingUp, BookOpen, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyGoal {
  id: string;
  title: string;
  target_hours: number;
  current_hours: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
}

interface WeeklyPlan {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface StudyPlanProps {
  user: User;
}

export const StudyPlan = ({ user }: StudyPlanProps) => {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { toast } = useToast();

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  useEffect(() => {
    loadStudyData();
  }, [user]);

  const loadStudyData = async () => {
    try {
      // Simuler le chargement des objectifs d'étude
      const mockGoals: StudyGoal[] = [
        {
          id: '1',
          title: 'Maîtriser les Cryptomonnaies',
          target_hours: 20,
          current_hours: 12,
          deadline: '2024-02-15',
          category: 'Blockchain',
          status: 'active'
        },
        {
          id: '2',
          title: 'Finance Personnelle',
          target_hours: 15,
          current_hours: 8,
          deadline: '2024-02-20',
          category: 'Finance',
          status: 'active'
        },
        {
          id: '3',
          title: 'Intelligence Artificielle',
          target_hours: 25,
          current_hours: 25,
          deadline: '2024-01-30',
          category: 'IA',
          status: 'completed'
        }
      ];

      const mockWeeklyPlan: WeeklyPlan = {
        monday: ['Cours Crypto - 1h', 'Quiz Finance - 30min'],
        tuesday: ['Lecture IA - 45min', 'Exercices pratiques - 1h'],
        wednesday: ['Révision Blockchain - 1h'],
        thursday: ['Nouveau cours Finance - 1h30min'],
        friday: ['Quiz récapitulatif - 1h'],
        saturday: ['Projet personnel - 2h'],
        sunday: ['Révision générale - 1h']
      };

      setGoals(mockGoals);
      setWeeklyPlan(mockWeeklyPlan);
    } catch (error) {
      console.error('Error loading study data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, additionalHours: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current_hours: Math.min(goal.current_hours + additionalHours, goal.target_hours) }
        : goal
    ));
    
    toast({
      title: "Progression mise à jour !",
      description: `+${additionalHours}h ajoutée à votre objectif`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Mon Plan d'Études</h2>
          <p className="text-gray-600">Organisez votre apprentissage et atteignez vos objectifs</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Target className="h-4 w-4 mr-2" />
          Nouvel Objectif
        </Button>
      </div>

      {/* Study Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className={`relative overflow-hidden ${
            goal.status === 'completed' ? 'bg-green-50 border-green-200' :
            goal.status === 'active' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={
                  goal.status === 'completed' ? 'default' :
                  goal.status === 'active' ? 'secondary' : 'outline'
                }>
                  {goal.category}
                </Badge>
                {goal.status === 'completed' && (
                  <Award className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span>{goal.current_hours}h / {goal.target_hours}h</span>
                  </div>
                  <Progress 
                    value={(goal.current_hours / goal.target_hours) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                </div>

                {goal.status === 'active' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, 0.5)}
                    >
                      +30min
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, 1)}
                    >
                      +1h
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Planning Hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {days.map((day, index) => (
              <div key={day} className="space-y-2">
                <h4 className="font-medium text-center py-2 bg-gray-100 rounded-lg">
                  {day}
                </h4>
                <div className="space-y-2 min-h-[120px]">
                  {weeklyPlan?.[dayKeys[index]]?.map((activity, actIndex) => (
                    <div 
                      key={actIndex}
                      className="p-2 bg-blue-50 border border-blue-200 rounded text-xs"
                    >
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-blue-600" />
                        {activity}
                      </div>
                    </div>
                  )) || (
                    <div className="p-2 text-gray-400 text-xs text-center">
                      Aucune activité
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">47h</p>
            <p className="text-sm text-gray-600">Cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-600">Cours terminés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">85%</p>
            <p className="text-sm text-gray-600">Objectifs atteints</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-600">Certificats obtenus</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
