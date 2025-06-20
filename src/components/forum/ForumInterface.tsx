
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  ThumbsUp, 
  Users, 
  Plus, 
  Search,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
  is_solved: boolean;
}

interface ForumInterfaceProps {
  user: User;
}

export const ForumInterface = ({ user }: ForumInterfaceProps) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'finance'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'Toutes', icon: Users },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'technology', label: 'Technologie', icon: BookOpen },
    { id: 'general', label: 'Général', icon: MessageSquare }
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchTerm]);

  const loadPosts = async () => {
    try {
      // Ici on chargerait les posts depuis une table forum_posts
      // Pour la démo, on utilise des données simulées
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          title: 'Comment bien gérer mon budget étudiant ?',
          content: 'J\'aimerais des conseils pour mieux gérer mes finances en tant qu\'étudiant...',
          category: 'finance',
          author_id: '1',
          author_name: 'Aminata D.',
          created_at: '2024-01-15T10:00:00Z',
          likes_count: 12,
          replies_count: 8,
          is_solved: false
        },
        {
          id: '2',
          title: 'Blockchain expliquée simplement ?',
          content: 'Quelqu\'un peut-il m\'expliquer la blockchain de manière simple ?',
          category: 'technology',
          author_id: '2',
          author_name: 'Ibrahim K.',
          created_at: '2024-01-14T15:30:00Z',
          likes_count: 25,
          replies_count: 15,
          is_solved: true
        }
      ];

      let filteredPosts = mockPosts;
      
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
      }
      
      if (searchTerm) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ici on créerait le post dans la base de données
      toast({
        title: "Post créé !",
        description: "Votre question a été publiée avec succès.",
      });
      
      setNewPost({ title: '', content: '', category: 'finance' });
      setShowNewPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum d'Entraide</h1>
        <p className="text-gray-600">Posez vos questions et aidez la communauté WL</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans le forum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowNewPost(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvelle question</span>
          </Button>
        </div>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Poser une nouvelle question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de votre question..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="finance">Finance</option>
              <option value="technology">Technologie</option>
              <option value="general">Général</option>
            </select>
            
            <Textarea
              placeholder="Décrivez votre question en détail..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreatePost}>
                Publier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune question trouvée</p>
              <p className="text-sm text-gray-500 mt-2">
                Soyez le premier à poser une question !
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {post.author_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author_name}</p>
                      <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={post.category === 'finance' ? 'default' : 'secondary'}>
                      {post.category === 'finance' ? 'Finance' : 'Tech'}
                    </Badge>
                    {post.is_solved && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Résolu
                      </Badge>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-2">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.replies_count} réponses</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    Voir la discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
