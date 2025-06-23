
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  FileText, 
  Video, 
  HelpCircle, 
  Brain, 
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIContentGeneratorProps {
  onContentGenerated: (content: any) => void;
}

export const AIContentGenerator = ({ onContentGenerated }: AIContentGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('course');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { toast } = useToast();

  // États pour les différents types de génération
  const [coursePrompt, setCoursePrompt] = useState('');
  const [quizPrompt, setQuizPrompt] = useState('');
  const [transcriptionFile, setTranscriptionFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState('educational');
  const [targetAudience, setTargetAudience] = useState('students');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [language, setLanguage] = useState('fr');

  const generateCourseContent = async () => {
    if (!coursePrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet de cours",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulation d'appel IA avancé
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const courseStructure = {
        title: `Cours complet: ${coursePrompt}`,
        description: `Cours détaillé sur ${coursePrompt} adapté pour ${targetAudience} africains`,
        level: difficulty,
        category: getIntelligentCategory(coursePrompt),
        estimatedDuration: calculateDuration(coursePrompt),
        modules: generateAdvancedModules(coursePrompt),
        assessments: generateAssessments(coursePrompt),
        resources: generateResources(coursePrompt),
        learningObjectives: generateLearningObjectives(coursePrompt)
      };

      setGeneratedContent(courseStructure);
      onContentGenerated(courseStructure);

      toast({
        title: "Contenu généré !",
        description: `Cours de ${courseStructure.modules.length} modules créé avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuiz = async () => {
    if (!quizPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet pour le quiz",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const quiz = {
        title: `Quiz: ${quizPrompt}`,
        questions: generateIntelligentQuestions(quizPrompt),
        timeLimit: 30,
        passingScore: 70,
        difficulty: difficulty
      };

      setGeneratedContent(quiz);

      toast({
        title: "Quiz généré !",
        description: `${quiz.questions.length} questions créées`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le quiz",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const processTranscription = async () => {
    if (!transcriptionFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier audio",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const transcription = {
        originalFile: transcriptionFile.name,
        transcript: generateSampleTranscript(),
        chapters: generateChapters(),
        keyPoints: extractKeyPoints(),
        suggestedQuestions: generateQuestionsFromTranscript()
      };

      setGeneratedContent(transcription);

      toast({
        title: "Transcription terminée !",
        description: "Contenu extrait et structuré avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter la transcription",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Fonctions utilitaires pour la génération IA
  const getIntelligentCategory = (prompt: string) => {
    const keywords = prompt.toLowerCase();
    if (keywords.includes('finance') || keywords.includes('argent') || keywords.includes('économie')) return 'finance';
    if (keywords.includes('tech') || keywords.includes('informatique') || keywords.includes('programmation')) return 'technology';
    if (keywords.includes('motivation') || keywords.includes('développement')) return 'personal_development';
    return 'general';
  };

  const calculateDuration = (prompt: string) => {
    const complexity = prompt.split(' ').length;
    return Math.max(60, Math.min(300, complexity * 10));
  };

  const generateAdvancedModules = (topic: string) => {
    return [
      {
        id: 1,
        title: `Introduction à ${topic}`,
        type: 'video',
        duration: 15,
        content: `Découvrez les fondamentaux de ${topic} dans le contexte africain...`,
        interactive: true,
        hasQuiz: true
      },
      {
        id: 2,
        title: `Concepts clés de ${topic}`,
        type: 'text',
        duration: 25,
        content: `Approfondissement des concepts essentiels...`,
        interactive: true,
        hasQuiz: true
      },
      {
        id: 3,
        title: `Applications pratiques`,
        type: 'mixed',
        duration: 30,
        content: `Exemples concrets et cas d'usage en Afrique...`,
        interactive: true,
        hasQuiz: true
      },
      {
        id: 4,
        title: `Projet final`,
        type: 'project',
        duration: 45,
        content: `Mise en pratique complète de vos connaissances...`,
        interactive: true,
        hasQuiz: false
      }
    ];
  };

  const generateAssessments = (topic: string) => {
    return [
      {
        type: 'quiz',
        title: `Évaluation ${topic}`,
        questions: 10,
        timeLimit: 20
      },
      {
        type: 'project',
        title: `Projet pratique ${topic}`,
        description: 'Application concrète des concepts appris'
      }
    ];
  };

  const generateResources = (topic: string) => {
    return [
      `Guide PDF: Les bases de ${topic}`,
      `Checklist: Points clés à retenir`,
      `Liens utiles et ressources complémentaires`,
      `Templates et outils pratiques`
    ];
  };

  const generateLearningObjectives = (topic: string) => {
    return [
      `Comprendre les principes fondamentaux de ${topic}`,
      `Appliquer les concepts dans un contexte africain`,
      `Développer des compétences pratiques`,
      `Être capable de former d'autres personnes`
    ];
  };

  const generateIntelligentQuestions = (topic: string) => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      question: `Question ${i + 1} sur ${topic}`,
      type: i % 3 === 0 ? 'multiple' : i % 3 === 1 ? 'true_false' : 'text',
      options: i % 3 === 0 ? [
        'Option A - Correct',
        'Option B - Incorrect',
        'Option C - Incorrect',
        'Option D - Incorrect'
      ] : i % 3 === 1 ? ['Vrai', 'Faux'] : undefined,
      correctAnswer: i % 3 === 0 ? 0 : i % 3 === 1 ? 0 : 'Réponse attendue',
      explanation: `Explication détaillée pour la question ${i + 1}`,
      points: Math.floor(Math.random() * 5) + 5
    }));
  };

  const generateSampleTranscript = () => {
    return "Bonjour et bienvenue dans cette présentation. Aujourd'hui, nous allons explorer un sujet fascinant qui touche directement notre quotidien en Afrique...";
  };

  const generateChapters = () => {
    return [
      { timestamp: '00:00', title: 'Introduction' },
      { timestamp: '05:30', title: 'Contexte africain' },
      { timestamp: '12:15', title: 'Exemples pratiques' },
      { timestamp: '18:45', title: 'Applications' },
      { timestamp: '25:30', title: 'Conclusion' }
    ];
  };

  const extractKeyPoints = () => {
    return [
      'Point clé 1: Adaptation au contexte local',
      'Point clé 2: Solutions innovantes',
      'Point clé 3: Impact communautaire',
      'Point clé 4: Durabilité'
    ];
  };

  const generateQuestionsFromTranscript = () => {
    return [
      'Quels sont les défis spécifiques mentionnés ?',
      'Comment adapter ces solutions au contexte africain ?',
      'Quelles sont les opportunités identifiées ?'
    ];
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    toast({
      title: "Copié !",
      description: "Contenu copié dans le presse-papiers",
    });
  };

  const downloadContent = (content: any, filename: string) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Générateur de Contenu IA Avancé
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="course" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Cours Complet</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>Quiz IA</span>
              </TabsTrigger>
              <TabsTrigger value="transcription" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Transcription</span>
              </TabsTrigger>
            </TabsList>

            {/* Configuration globale */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6 p-4 bg-white rounded-lg border">
              <div>
                <Label htmlFor="language">Langue</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="audience">Public cible</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">Étudiants</SelectItem>
                    <SelectItem value="professionals">Professionnels</SelectItem>
                    <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                    <SelectItem value="general">Grand public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Niveau</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contentType">Type de contenu</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Éducatif</SelectItem>
                    <SelectItem value="practical">Pratique</SelectItem>
                    <SelectItem value="theoretical">Théorique</SelectItem>
                    <SelectItem value="mixed">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="course" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="course-prompt">Sujet du cours</Label>
                  <Textarea
                    id="course-prompt"
                    placeholder="Ex: Gestion financière pour les entrepreneurs africains, incluant mobile money, microfinance et stratégies d'investissement local..."
                    value={coursePrompt}
                    onChange={(e) => setCoursePrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={generateCourseContent}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Générer le Cours Complet
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quiz-prompt">Sujet du quiz</Label>
                  <Textarea
                    id="quiz-prompt"
                    placeholder="Ex: Quiz sur les bases de la finance personnelle en Afrique, incluant l'épargne, les investissements et la gestion des risques..."
                    value={quizPrompt}
                    onChange={(e) => setQuizPrompt(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={generateQuiz}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Générer le Quiz IA
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="transcription" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="transcription-file">Fichier audio/vidéo</Label>
                  <Input
                    id="transcription-file"
                    type="file"
                    accept="audio/*,video/*"
                    onChange={(e) => setTranscriptionFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Formats supportés: MP3, MP4, WAV, WebM (max 100MB)
                  </p>
                </div>
                <Button 
                  onClick={processTranscription}
                  disabled={isGenerating || !transcriptionFile}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      Traiter et Structurer
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Affichage du contenu généré */}
          {generatedContent && (
            <Card className="mt-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span>Contenu Généré</span>
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadContent(generatedContent, 'contenu-genere')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTab === 'course' && generatedContent.modules && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{generatedContent.title}</h3>
                      <p className="text-gray-600 mb-4">{generatedContent.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{generatedContent.category}</Badge>
                        <Badge variant="outline">{generatedContent.level}</Badge>
                        <Badge variant="outline">{generatedContent.estimatedDuration}min</Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Modules ({generatedContent.modules.length})</h4>
                        {generatedContent.modules.map((module: any) => (
                          <div key={module.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span>{module.title}</span>
                            <div className="flex space-x-2">
                              <Badge variant="secondary">{module.type}</Badge>
                              <Badge variant="outline">{module.duration}min</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'quiz' && generatedContent.questions && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{generatedContent.title}</h3>
                      <div className="flex space-x-4 mb-4">
                        <Badge variant="outline">{generatedContent.questions.length} questions</Badge>
                        <Badge variant="outline">{generatedContent.timeLimit}min</Badge>
                        <Badge variant="outline">{generatedContent.passingScore}% requis</Badge>
                      </div>
                      <div className="space-y-2">
                        {generatedContent.questions.slice(0, 3).map((q: any) => (
                          <div key={q.id} className="p-3 bg-white rounded border">
                            <p className="font-medium">{q.question}</p>
                            <Badge variant="secondary" className="mt-1">{q.type}</Badge>
                          </div>
                        ))}
                        {generatedContent.questions.length > 3 && (
                          <p className="text-sm text-gray-600 text-center">
                            ... et {generatedContent.questions.length - 3} autres questions
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'transcription' && generatedContent.transcript && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Transcription: {generatedContent.originalFile}</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Chapitres</h4>
                          <div className="space-y-1">
                            {generatedContent.chapters.map((chapter: any, i: number) => (
                              <div key={i} className="flex items-center space-x-2 text-sm">
                                <Badge variant="outline">{chapter.timestamp}</Badge>
                                <span>{chapter.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Points clés</h4>
                          <ul className="space-y-1">
                            {generatedContent.keyPoints.map((point: string, i: number) => (
                              <li key={i} className="text-sm">• {point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
