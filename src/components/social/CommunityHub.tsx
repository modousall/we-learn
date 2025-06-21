
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  BookOpen,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    level: string;
    points: number;
  };
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  isLiked: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  next_session: string;
  location: 'online' | 'offline';
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
}

interface CommunityHubProps {
  user: User;
}

export const CommunityHub = ({ user }: CommunityHubProps) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      // Mock data for community posts
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          author: {
            name: 'Amina Diallo',
            avatar: '/api/placeholder/40/40',
            level: 'Expert Crypto',
            points: 2450
          },
          content: 'Viens de terminer le module sur les DeFi ! Quelqu\'un d\'autre a trouvé la partie sur les pools de liquidité difficile ? 🤔',
          category: 'Blockchain',
          likes: 23,
          comments: 8,
          timestamp: '2h',
          tags: ['DeFi', 'Apprentissage'],
          isLiked: false
        },
        {
          id: '2',
          author: {
            name: 'Ibrahim Kone',
            avatar: '/api/placeholder/40/40',
            level: 'Maître Finance',
            points: 3200
          },
          content: 'Excellente explication sur la budgétisation dans le dernier cours ! J\'ai enfin compris comment équilibrer mon budget mensuel 💡',
          category: 'Finance',
          likes: 34,
          comments: 12,
          timestamp: '4h',
          tags: ['Budget', 'Conseil'],
          isLiked: true
        },
        {
          id: '3',
          author: {
            name: 'Fatima Ba',
            avatar: '/api/placeholder/40/40',
            level: 'Apprentie IA',
            points: 1200
          },
          content: 'Qui veut former un groupe d\'étude pour le prochain module sur l\'apprentissage automatique ? 🤖',
          category: 'IA',
          likes: 15,
          comments: 6,
          timestamp: '6h',
          tags: ['Groupe', 'IA', 'Étude'],
          isLiked: false
        }
      ];

      const mockStudyGroups: StudyGroup[] = [
        {
          id: '1',
          name: 'Crypto Débutants',
          description: 'Apprenons ensemble les bases de la blockchain et des cryptomonnaies',
          members: 24,
          category: 'Blockchain',
          next_session: '2024-01-25T18:00:00',
          location: 'online',
          difficulty: 'débutant'
        },
        {
          id: '2',
          name: 'Finance Avancée',
          description: 'Discussions sur l\'investissement et la planification financière',
          members: 18,
          category: 'Finance',
          next_session: '2024-01-24T20:00:00',
          location: 'offline',
          difficulty: 'avancé'
        },
        {
          id: '3',
          name: 'IA et Futur',
          description: 'Explorons l\'impact de l\'IA sur l\'économie africaine',
          members: 32,
          category: 'IA',
          next_session: '2024-01-26T19:00:00',
          location: 'online',
          difficulty: 'intermédiaire'
        }
      ];

      setPosts(mockPosts);
      setStudyGroups(mockStudyGroups);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    toast({
      title: "Publication créée !",
      description: "Votre message a été partagé avec la communauté",
    });
    
    setNewPost('');
  };

  const joinStudyGroup = (groupId: string) => {
    toast({
      title: "Groupe rejoint !",
      description: "Vous avez rejoint le groupe d'étude avec succès",
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
      <div className="text-center py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl">
        <h1 className="text-4xl font-bold mb-2">Hub Communautaire</h1>
        <p className="text-xl opacity-90">Connectez-vous, apprenez et grandissez ensemble</p>
        <div className="flex justify-center space-x-8 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold">2,847</p>
            <p className="text-sm opacity-80">Membres actifs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm opacity-80">Discussions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">42</p>
            <p className="text-sm opacity-80">Groupes d'étude</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Fil d'actualité</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Groupes d'étude</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Événements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Partagez vos réflexions avec la communauté..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="text-lg"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge variant="outline">Finance</Badge>
                      <Badge variant="outline">Blockchain</Badge>
                      <Badge variant="outline">IA</Badge>
                    </div>
                    <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                      Publier
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{post.author.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {post.author.level}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 mr-1" />
                          {post.author.points} pts
                        </div>
                        <span className="text-gray-500 text-sm">• {post.timestamp}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={post.isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Partager
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant={
                      group.difficulty === 'débutant' ? 'secondary' :
                      group.difficulty === 'intermédiaire' ? 'default' : 'destructive'
                    }>
                      {group.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{group.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {group.members} membres
                    </div>
                    <Badge variant="outline">{group.category}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Prochaine session: {new Date(group.next_session).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {group.location === 'online' ? 'En ligne' : 'Présentiel'}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => joinStudyGroup(group.id)}
                  >
                    Rejoindre le groupe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Événements à venir
            </h3>
            <p className="text-gray-600 mb-6">
              Participez aux webinaires, conférences et ateliers de la communauité We Learn
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Voir les événements
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
