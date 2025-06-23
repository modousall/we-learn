
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Trash2, Eye, Edit, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIContentGenerator } from './AIContentGenerator';
import { ContentEditor } from './ContentEditor';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_minutes: number;
  is_premium: boolean;
  price_fcfa: number;
  content?: any;
}

interface CourseCreatorProps {
  user: User;
  onCourseCreated: () => void;
}

export const CourseCreator = ({ user, onCourseCreated }: CourseCreatorProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'finance',
    level: 'debutant',
    duration_minutes: 60,
    is_premium: false,
    price_fcfa: 0,
    modules: [] as any[]
  });
  const { toast } = useToast();

  React.useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const handleAIContentGenerated = (content: any) => {
    setFormData({
      title: content.title || formData.title,
      description: content.description || formData.description,
      category: content.category || formData.category,
      level: content.level || formData.level,
      duration_minutes: content.estimatedDuration || formData.duration_minutes,
      is_premium: content.estimatedDuration > 120,
      price_fcfa: content.estimatedDuration > 120 ? 5000 : 0,
      modules: content.modules || []
    });

    // Passer automatiquement à l'onglet création
    setActiveTab('create');
  };

  const createCourse = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du cours est requis",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert([{
          ...formData,
          content: { modules: formData.modules },
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Cours créé !",
        description: "Le nouveau cours a été créé avec succès.",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'finance',
        level: 'debutant',
        duration_minutes: 60,
        is_premium: false,
        price_fcfa: 0,
        modules: []
      });

      loadCourses();
      onCourseCreated();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le cours",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });

      loadCourses();
      onCourseCreated();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive"
      });
    }
  };

  const saveModules = (modules: any[]) => {
    setFormData({ ...formData, modules });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>Studio de Création de Cours IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generator" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Générateur IA</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Créer</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Éditeur</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Gérer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="mt-6">
              <AIContentGenerator onContentGenerated={handleAIContentGenerated} />
            </TabsContent>

            <TabsContent value="create" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Création de Cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du cours</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Titre du cours"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Description du cours"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="technology">Technologie</SelectItem>
                          <SelectItem value="personal_development">Développement Personnel</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="health">Santé</SelectItem>
                          <SelectItem value="education">Éducation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Niveau</Label>
                      <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debutant">Débutant</SelectItem>
                          <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                          <SelectItem value="avance">Avancé</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="premium"
                        checked={formData.is_premium}
                        onCheckedChange={(checked) => setFormData({...formData, is_premium: checked})}
                      />
                      <Label htmlFor="premium">Cours Premium</Label>
                    </div>

                    {formData.is_premium && (
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="price">Prix (FCFA)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price_fcfa}
                          onChange={(e) => setFormData({...formData, price_fcfa: parseInt(e.target.value)})}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>

                  {formData.modules.length > 0 && (
                    <div className="space-y-2">
                      <Label>Modules générés ({formData.modules.length})</Label>
                      <div className="space-y-2">
                        {formData.modules.map((module: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{module.title}</span>
                            <div className="flex space-x-2">
                              <Badge variant="outline">{module.type}</Badge>
                              <Badge variant="outline">{module.duration}min</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={createCourse} disabled={isCreating} className="w-full">
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Création...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer le Cours
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-6">
              <ContentEditor
                courseId={selectedCourse?.id}
                initialModules={formData.modules}
                onSave={saveModules}
              />
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Cours Existants ({courses.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">{course.category}</Badge>
                            <Badge variant="outline">{course.level}</Badge>
                            <Badge variant="outline">{course.duration_minutes}min</Badge>
                            {course.is_premium && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Premium - {course.price_fcfa} FCFA
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedCourse(course);
                              setActiveTab('edit');
                            }}
                            title="Éditer le cours"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Voir le cours">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Supprimer le cours"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {courses.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun cours créé pour le moment</p>
                        <p className="text-sm text-gray-500">Utilisez le générateur IA pour créer votre premier cours</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
