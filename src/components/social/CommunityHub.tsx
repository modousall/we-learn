import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Calendar, ThumbsUp, Share2, Plus, ArrowLeft, Search } from 'lucide-react';

interface CommunityHubProps {
  user: User;
  onBack?: () => void;
}

export const CommunityHub = ({ user, onBack }: CommunityHubProps) =>  {
  const [posts, setPosts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, [user]);

  const loadCommunityData = async () => {
    try {
      // Mock data pour la démonstration
      setPosts([
        {
          id: 1,
          author: 'Marie Diop',
          avatar: '/api/placeholder/40/40',
          content: 'Quelqu\'un peut-il m\'expliquer la différence entre Bitcoin et Ethereum ?',
          likes: 12,
          comments: 5,
          time: '2h',
          category: 'Question'
        },
        {
          id: 2,
          author: 'Amadou Tall',
          avatar: '/api/placeholder/40/40',
          content: 'Super cours sur la DeFi ! J\'ai enfin compris les yield farms 🚀',
          likes: 28,
          comments: 8,
          time: '4h',
          category: 'Partage'
        }
      ]);

      setGroups([
        { id: 1, name: 'Crypto Débutants', members: 156, description: 'Pour ceux qui découvrent les cryptomonnaies' },
        { id: 2, name: 'Trading Avancé', members: 89, description: 'Stratégies et analyses techniques' },
        { id: 3, name: 'DeFi & NFTs', members: 203, description: 'Finance décentralisée et tokens non-fongibles' }
      ]);

      setEvents([
        { id: 1, title: 'Webinar Bitcoin', date: '25 Jan', time: '19h00', participants: 45 },
        { id: 2, title: 'Atelier Trading', date: '28 Jan', time: '15h00', participants: 23 }
      ]);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation optimisée */}
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
              <h1 className="text-2xl font-bold text-gray-900">Hub Communautaire</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 shadow-lg rounded-xl">
            <TabsTrigger 
              value="feed" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Fil d'Actualité</span>
            </TabsTrigger>
            <TabsTrigger 
              value="groups" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
            >
              <Users className="h-4 w-4" />
              <span>Groupes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>Événements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{post.author}</h4>
                          <p className="text-sm text-gray-500">{post.time}</p>
                        </div>
                        <Badge variant={post.category === 'Question' ? 'secondary' : 'default'}>
                          {post.category}
                        </Badge>
                      </div>
                      <p className="mb-4">{post.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600 transition-colors">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600 transition-colors">
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{group.name}</span>
                      <Badge>{group.members} membres</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                      Rejoindre le Groupe
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        <span>{event.date} à {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{event.participants} participants</span>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors">
                        S'inscrire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
