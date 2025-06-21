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
import { Wand2, Plus, Trash2, Eye, Edit, BookOpen } from 'lucide-react';
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
}

interface CourseCreatorProps {
  user: User;
  onCourseCreated: () => void;
}

export const CourseCreator = ({ user, onCourseCreated }: CourseCreatorProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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
  const [aiTopic, setAiTopic] = useState('');
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

  const generateCourseWithAI = async () => {
    if (!aiTopic.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet pour générer le cours",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI course generation
      const generatedCourse = {
        title: `Cours: ${aiTopic}`,
        description: `Cours complet sur ${aiTopic} adapté aux étudiants africains`,
        category: aiTopic.toLowerCase().includes('finance') || aiTopic.toLowerCase().includes('argent') ? 'finance' : 'technology',
        level: 'debutant',
        duration_minutes: 120,
        is_premium: false,
        price_fcfa: 0,
        modules: [
          {
            title: `Introduction à ${aiTopic}`,
            content: `Contenu d'introduction généré par IA pour ${aiTopic}`,
            type: 'text'
          },
          {
            title: `Concepts clés de ${aiTopic}`,
            content: `Explication des concepts principaux de ${aiTopic}`,
            type: 'text'
          },
          {
            title: `Applications pratiques`,
            content: `Exemples concrets et applications de ${aiTopic} en Afrique`,
            type: 'text'
          },
          {
            title: 'Quiz de validation',
            questions: [
              {
                question: `Quelle est l'importance de ${aiTopic} ?`,
                options: ['Très importante', 'Importante', 'Peu importante', 'Pas importante'],
                correct: 0
              }
            ],
            type: 'quiz'
          }
        ]
      };

      setFormData(generatedCourse);
      setAiTopic('');

      toast({
        title: "Cours généré !",
        description: "Le cours a été généré avec succès par l'IA. Vous pouvez maintenant le modifier et l'enregistrer.",
      });
    } catch (error) {
      console.error('Error generating course:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le cours avec l'IA",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const createCourse = async () => {
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
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Course Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-purple-600" />
            <span>Générateur de Cours IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Ex: Gestion budgétaire, Cryptomonnaies, Intelligence artificielle..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={generateCourseWithAI}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Générer avec IA
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            L'IA va créer un cours complet avec modules, quizz et contenus adaptés aux étudiants africains.
          </p>
        </CardContent>
      </Card>

      {/* Course Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-6 w-6" />
            <span>Créer un Nouveau Cours</span>
          </CardTitle>
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
                  <SelectItem value="general">Général</SelectItem>
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
                  <SelectItem value="essentiel">Essentiel</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
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

      {/* Existing Courses */}
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
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
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
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteCourse(course.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
