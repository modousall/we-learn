
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_url?: string;
  total_points: number;
  completed_courses: number;
  streak_days: number;
  school_name?: string;
  region?: string;
  rank: number;
}

interface LeaderboardProps {
  userId: string;
  scope: 'global' | 'school' | 'region';
}

export const Leaderboard = ({ userId, scope }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [scope, timeFrame]);

  const loadLeaderboard = async () => {
    try {
      // Simulation de données de leaderboard
      const mockData: LeaderboardEntry[] = [
        {
          id: '1',
          name: 'Aminata Diallo',
          total_points: 2850,
          completed_courses: 12,
          streak_days: 28,
          school_name: 'Lycée Lamine Guèye',
          region: 'Dakar',
          rank: 1
        },
        {
          id: '2',
          name: 'Ibrahim Koné',
          total_points: 2720,
          completed_courses: 11,
          streak_days: 21,
          school_name: 'Université Cheikh Anta Diop',
          region: 'Dakar',
          rank: 2
        },
        {
          id: '3',
          name: 'Fatou Sow',
          total_points: 2680,
          completed_courses: 10,
          streak_days: 35,
          school_name: 'École Supérieure Polytechnique',
          region: 'Thiès',
          rank: 3
        },
        {
          id: '4',
          name: 'Moussa Traoré',
          total_points: 2450,
          completed_courses: 9,
          streak_days: 15,
          school_name: 'Université Gaston Berger',
          region: 'Saint-Louis',
          rank: 4
        },
        {
          id: '5',
          name: 'Aïcha Ba',
          total_points: 2320,
          completed_courses: 8,
          streak_days: 42,
          school_name: 'Lycée Demba Diop',
          region: 'Mbour',
          rank: 5
        }
      ];

      setLeaderboard(mockData);
      
      // Simuler le rang de l'utilisateur actuel
      const currentUserRank: LeaderboardEntry = {
        id: userId,
        name: 'Vous',
        total_points: 1890,
        completed_courses: 6,
        streak_days: 12,
        rank: 8
      };
      setUserRank(currentUserRank);

    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'global':
        return 'Classement Global';
      case 'school':
        return 'Mon École';
      case 'region':
        return 'Ma Région';
      default:
        return 'Classement';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getScopeLabel(scope)}</h2>
          <p className="text-gray-600">Comparez vos performances avec la communauté</p>
        </div>
        
        <div className="flex gap-2">
          {['week', 'month', 'all'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFrame(period as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFrame === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'week' ? 'Cette semaine' : 
               period === 'month' ? 'Ce mois' : 'Tout temps'}
            </button>
          ))}
        </div>
      </div>

      {/* User's current rank */}
      {userRank && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  {getRankIcon(userRank.rank)}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Votre Position</h3>
                  <p className="text-sm text-blue-600">
                    #{userRank.rank} sur {leaderboard.length + 10}+ participants
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 text-blue-800">
                  <Star className="h-4 w-4" />
                  <span className="font-bold">{userRank.total_points.toLocaleString()}</span>
                </div>
                <p className="text-sm text-blue-600">{userRank.completed_courses} cours terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top performers */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement du classement...</p>
            </CardContent>
          </Card>
        ) : (
          leaderboard.map((entry) => (
            <Card key={entry.id} className={`transition-shadow hover:shadow-lg ${
              entry.rank <= 3 ? 'border-l-4 border-l-yellow-400' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    {/* User info */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar_url} />
                        <AvatarFallback>
                          {entry.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">{entry.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          {entry.school_name && (
                            <span>{entry.school_name}</span>
                          )}
                          {entry.region && (
                            <Badge variant="outline" className="text-xs">
                              {entry.region}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-lg font-bold">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>{entry.total_points.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{entry.completed_courses} cours</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🔥</span>
                        <span>{entry.streak_days} jours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Achievement badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Badges de la Semaine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium text-sm">Champion Finance</p>
              <p className="text-xs text-gray-600">10+ cours terminés</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-sm">Mentor</p>
              <p className="text-xs text-gray-600">5+ réponses forum</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-sm">Régularité</p>
              <p className="text-xs text-gray-600">7 jours consécutifs</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-sm">Quiz Master</p>
              <p className="text-xs text-gray-600">95% de réussite</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
