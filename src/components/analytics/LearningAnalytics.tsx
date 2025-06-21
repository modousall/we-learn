
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Brain,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

interface LearningAnalyticsProps {
  user: User;
}

export const LearningAnalytics = ({ user }: LearningAnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState({
    weeklyProgress: [],
    categoryDistribution: [],
    skillLevels: [],
    performanceMetrics: {},
    studyStreaks: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    // Simuler les données d'analyse d'apprentissage
    const mockData = {
      weeklyProgress: [
        { week: 'Sem 1', hours: 12, courses: 3, quizScore: 85 },
        { week: 'Sem 2', hours: 15, courses: 4, quizScore: 78 },
        { week: 'Sem 3', hours: 18, courses: 5, quizScore: 92 },
        { week: 'Sem 4', hours: 14, courses: 3, quizScore: 88 },
        { week: 'Sem 5', hours: 20, courses: 6, quizScore: 95 },
        { week: 'Sem 6', hours: 16, courses: 4, quizScore: 90 }
      ],
      categoryDistribution: [
        { name: 'Finance', value: 35, color: '#3B82F6' },
        { name: 'Blockchain', value: 25, color: '#8B5CF6' },
        { name: 'IA', value: 20, color: '#10B981' },
        { name: 'Entrepreneuriat', value: 15, color: '#F59E0B' },
        { name: 'Marketing', value: 5, color: '#EF4444' }
      ],
      skillLevels: [
        { skill: 'Finance', current: 85, target: 90 },
        { skill: 'Blockchain', current: 70, target: 85 },
        { skill: 'IA', current: 60, target: 80 },
        { skill: 'Marketing', current: 45, target: 70 },
        { skill: 'Entrepreneuriat', current: 75, target: 85 }
      ],
      performanceMetrics: {
        totalHours: 95,
        completedCourses: 25,
        averageScore: 87,
        currentStreak: 12,
        badges: 8,
        rank: 23
      },
      studyStreaks: [
        { day: 'Lun', studied: true },
        { day: 'Mar', studied: true },
        { day: 'Mer', studied: false },
        { day: 'Jeu', studied: true },
        { day: 'Ven', studied: true },
        { day: 'Sam', studied: true },
        { day: 'Dim', studied: false }
      ]
    };

    setAnalyticsData(mockData);
    setLoading(false);
  };

  const radarData = analyticsData.skillLevels.map(skill => ({
    subject: skill.skill,
    current: skill.current,
    target: skill.target
  }));

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
      <div className="text-center py-8 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white rounded-xl">
        <h1 className="text-4xl font-bold mb-2">Analyse de Performance</h1>
        <p className="text-xl opacity-90">Suivez vos progrès et optimisez votre apprentissage</p>
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analyticsData.performanceMetrics.totalHours}h</p>
            <p className="text-sm text-gray-600">Temps total</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analyticsData.performanceMetrics.completedCourses}</p>
            <p className="text-sm text-gray-600">Cours terminés</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analyticsData.performanceMetrics.averageScore}%</p>
            <p className="text-sm text-gray-600">Score moyen</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analyticsData.performanceMetrics.currentStreak}</p>
            <p className="text-sm text-gray-600">Jours consécutifs</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analyticsData.performanceMetrics.badges}</p>
            <p className="text-sm text-gray-600">Badges gagnés</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <Trophy className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">#{analyticsData.performanceMetrics.rank}</p>
            <p className="text-sm text-gray-600">Classement</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="distribution">Répartition</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="habits">Habitudes</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Progression Hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Heures d'étude"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quizScore" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Score quiz (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Répartition par Catégorie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temps par Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.categoryDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Radar des Compétences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Niveau actuel"
                        dataKey="current"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Objectif"
                        dataKey="target"
                        stroke="#10B981"
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progression des Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.skillLevels.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {skill.current}%
                          </span>
                          <Badge variant="outline">
                            Objectif: {skill.target}%
                          </Badge>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={skill.current} className="h-2" />
                        <div 
                          className="absolute top-0 h-2 w-1 bg-green-500 rounded"
                          style={{ left: `${skill.target}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="habits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Habitudes d'Étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Study Streak */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Série d'étude actuelle</h3>
                  <div className="flex space-x-2 justify-center">
                    {analyticsData.studyStreaks.map((day, index) => (
                      <div
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium ${
                          day.studied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {day.day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Study Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-semibold">Moment optimal</h4>
                      <p className="text-sm text-gray-600">18h-20h</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold">Durée recommandée</h4>
                      <p className="text-sm text-gray-600">45-60 min</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-semibold">Focus principal</h4>
                      <p className="text-sm text-gray-600">Blockchain</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
