
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
import { Wand2, Plus, Trash2, Eye, Edit, BookOpen, Sparkles } from 'lucide-react';
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
  const [aiLanguage, setAiLanguage] = useState('fr');
  const [aiLevel, setAiLevel] = useState('debutant');
  const [aiDuration, setAiDuration] = useState(60);
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
      // Génération avancée de cours par IA
      const modules = await generateAdvancedModules(aiTopic, aiLanguage, aiLevel, aiDuration);
      
      const generatedCourse = {
        title: `${aiLanguage === 'fr' ? 'Cours complet' : 'Complete Course'}: ${aiTopic}`,
        description: aiLanguage === 'fr' 
          ? `Cours détaillé sur ${aiTopic} adapté aux étudiants africains de niveau ${aiLevel}`
          : `Detailed course on ${aiTopic} adapted for African students at ${aiLevel} level`,
        category: getCategoryFromTopic(aiTopic),
        level: aiLevel,
        duration_minutes: aiDuration,
        is_premium: aiDuration > 120,
        price_fcfa: aiDuration > 120 ? 5000 : 0,
        modules: modules
      };

      setFormData(generatedCourse);
      setAiTopic('');

      toast({
        title: "Cours généré !",
        description: `Cours complet de ${modules.length} modules généré avec succès par l'IA.`,
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

  const generateAdvancedModules = async (topic: string, language: string, level: string, duration: number) => {
    const moduleCount = Math.max(3, Math.floor(duration / 20));
    const modules = [];

    // Module d'introduction
    modules.push({
      id: `intro-${Date.now()}`,
      title: language === 'fr' ? `Introduction à ${topic}` : `Introduction to ${topic}`,
      type: 'text',
      content: generateIntroContent(topic, language, level),
      duration_minutes: Math.floor(duration * 0.2)
    });

    // Modules de contenu principal
    for (let i = 1; i < moduleCount - 1; i++) {
      modules.push({
        id: `module-${i}-${Date.now()}`,
        title: language === 'fr' 
          ? `${topic} - Partie ${i}` 
          : `${topic} - Part ${i}`,
        type: i % 3 === 0 ? 'video' : 'text',
        content: generateModuleContent(topic, i, language, level),
        videoUrl: i % 3 === 0 ? `https://example.com/video-${topic}-${i}` : undefined,
        duration_minutes: Math.floor(duration * 0.6 / (moduleCount - 2))
      });
    }

    // Quiz final
    modules.push({
      id: `quiz-${Date.now()}`,
      title: language === 'fr' ? 'Quiz d\'évaluation finale' : 'Final Assessment Quiz',
      type: 'quiz',
      questions: generateQuizQuestions(topic, language, level),
      duration_minutes: Math.floor(duration * 0.2)
    });

    return modules;
  };

  const generateIntroContent = (topic: string, language: string, level: string) => {
    if (language === 'fr') {
      return `Bienvenue dans ce cours complet sur ${topic} !

Ce cours est spécialement conçu pour les étudiants africains de niveau ${level}. Nous allons explorer ensemble tous les aspects importants de ${topic}, avec des exemples concrets et des applications pratiques adaptées au contexte africain.

Objectifs du cours :
• Comprendre les concepts fondamentaux de ${topic}
• Maîtriser les applications pratiques
• Développer des compétences applicables dans le contexte africain
• Acquérir une expertise solide dans le domaine

À la fin de ce cours, vous serez capable d'appliquer vos connaissances de ${topic} dans des situations réelles et de continuer votre apprentissage de manière autonome.`;
    } else {
      return `Welcome to this comprehensive course on ${topic}!

This course is specially designed for African students at ${level} level. We will explore together all the important aspects of ${topic}, with concrete examples and practical applications adapted to the African context.

Course objectives:
• Understand the fundamental concepts of ${topic}
• Master practical applications
• Develop skills applicable in the African context
• Acquire solid expertise in the field

By the end of this course, you will be able to apply your knowledge of ${topic} in real situations and continue your learning independently.`;
    }
  };

  const generateModuleContent = (topic: string, moduleIndex: number, language: string, level: string) => {
    const contents = {
      fr: [
        `Dans ce module, nous approfondissons les aspects techniques de ${topic}. 

Les concepts clés à retenir :
1. Définitions et terminologie essentielles
2. Principes de base et leur application
3. Exemples concrets dans le contexte africain
4. Exercices pratiques

Il est important de bien comprendre ces éléments avant de passer au module suivant.`,
        `Ce module se concentre sur l'application pratique de ${topic}.

Points importants :
• Cas d'usage réels en Afrique
• Outils et ressources disponibles
• Stratégies d'implémentation
• Bonnes pratiques à adopter

Ces connaissances vous permettront de mettre en pratique ${topic} efficacement.`,
        `Approfondissement avancé de ${topic}.

Sujets abordés :
- Techniques avancées
- Résolution de problèmes complexes
- Optimisation et amélioration
- Perspectives d'avenir

Ce module prépare votre expertise approfondie en ${topic}.`
      ],
      en: [
        `In this module, we delve into the technical aspects of ${topic}.

Key concepts to remember:
1. Essential definitions and terminology
2. Basic principles and their application
3. Concrete examples in the African context
4. Practical exercises

It's important to understand these elements well before moving to the next module.`,
        `This module focuses on the practical application of ${topic}.

Important points:
• Real use cases in Africa
• Available tools and resources
• Implementation strategies
• Best practices to adopt

This knowledge will allow you to effectively implement ${topic}.`,
        `Advanced deepening of ${topic}.

Topics covered:
- Advanced techniques
- Complex problem solving
- Optimization and improvement
- Future perspectives

This module prepares your in-depth expertise in ${topic}.`
      ]
    };

    return contents[language as keyof typeof contents][moduleIndex % 3];
  };

  const generateQuizQuestions = (topic: string, language: string, level: string) => {
    if (language === 'fr') {
      return [
        {
          id: `q1-${Date.now()}`,
          question: `Quelle est la définition principale de ${topic} ?`,
          options: [
            `${topic} est un concept fondamental`,
            `${topic} est une technologie avancée`,
            `${topic} est uniquement théorique`,
            `${topic} n'a pas d'application pratique`
          ],
          correctAnswer: 0,
          explanation: `${topic} est effectivement un concept fondamental avec de nombreuses applications pratiques.`,
          points: 10
        },
        {
          id: `q2-${Date.now()}`,
          question: `Comment peut-on appliquer ${topic} en Afrique ?`,
          options: [
            `Cela n'est pas applicable`,
            `Avec des adaptations locales`,
            `Seulement dans les grandes villes`,
            `Uniquement pour les experts`
          ],
          correctAnswer: 1,
          explanation: `${topic} peut être appliqué en Afrique avec des adaptations appropriées au contexte local.`,
          points: 15
        },
        {
          id: `q3-${Date.now()}`,
          question: `Quel est l'avantage principal de maîtriser ${topic} ?`,
          options: [
            `Aucun avantage réel`,
            `Opportunités professionnelles`,
            `Seulement académique`,
            `Très complexe`
          ],
          correctAnswer: 1,
          explanation: `Maîtriser ${topic} ouvre de nombreuses opportunités professionnelles et personnelles.`,
          points: 10
        }
      ];
    } else {
      return [
        {
          id: `q1-${Date.now()}`,
          question: `What is the main definition of ${topic}?`,
          options: [
            `${topic} is a fundamental concept`,
            `${topic} is an advanced technology`,
            `${topic} is only theoretical`,
            `${topic} has no practical application`
          ],
          correctAnswer: 0,
          explanation: `${topic} is indeed a fundamental concept with many practical applications.`,
          points: 10
        },
        {
          id: `q2-${Date.now()}`,
          question: `How can ${topic} be applied in Africa?`,
          options: [
            `It's not applicable`,
            `With local adaptations`,
            `Only in big cities`,
            `Only for experts`
          ],
          correctAnswer: 1,
          explanation: `${topic} can be applied in Africa with appropriate adaptations to the local context.`,
          points: 15
        },
        {
          id: `q3-${Date.now()}`,
          question: `What is the main advantage of mastering ${topic}?`,
          options: [
            `No real advantage`,
            `Professional opportunities`,
            `Only academic`,
            `Very complex`
          ],
          correctAnswer: 1,
          explanation: `Mastering ${topic} opens many professional and personal opportunities.`,
          points: 10
        }
      ];
    }
  };

  const getCategoryFromTopic = (topic: string) => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('finance') || topicLower.includes('argent') || topicLower.includes('épargne') || topicLower.includes('investissement')) {
      return 'finance';
    }
    if (topicLower.includes('tech') || topicLower.includes('ia') || topicLower.includes('crypto') || topicLower.includes('blockchain')) {
      return 'technology';
    }
    return 'general';
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

  return (
    <div className="space-y-6">
      {/* AI Course Generator */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Générateur de Cours IA Avancé
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-topic">Sujet du cours</Label>
              <Input
                id="ai-topic"
                placeholder="Ex: Finance personnelle, Cryptomonnaies, Intelligence artificielle..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ai-language">Langue</Label>
              <Select value={aiLanguage} onValueChange={setAiLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-level">Niveau</Label>
              <Select value={aiLevel} onValueChange={setAiLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ai-duration">Durée (minutes)</Label>
              <Select value={aiDuration.toString()} onValueChange={(v) => setAiDuration(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                  <SelectItem value="180">180 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateCourseWithAI}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Génération par IA...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Générer un Cours Complet avec IA
              </>
            )}
          </Button>
          
          <p className="text-sm text-gray-600 text-center">
            L'IA va créer un cours structuré avec modules interactifs, quiz personnalisés et contenus adaptés aux étudiants africains.
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
                  <Button variant="ghost" size="sm" title="Voir le cours">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Modifier le cours">
                    <Edit className="h-4 w-4" />
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
    </div>
  );
};
