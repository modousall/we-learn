
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit3, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Move, 
  Image, 
  Video, 
  FileText,
  Settings,
  Clock,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'project';
  content: string;
  duration: number;
  order: number;
  isPublished: boolean;
  resources?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface ContentEditorProps {
  courseId?: string;
  initialModules?: Module[];
  onSave: (modules: Module[]) => void;
}

export const ContentEditor = ({ courseId, initialModules = [], onSave }: ContentEditorProps) => {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const moduleTypes = [
    { value: 'video', label: 'Vidéo', icon: Video },
    { value: 'text', label: 'Texte', icon: FileText },
    { value: 'quiz', label: 'Quiz', icon: Target },
    { value: 'interactive', label: 'Interactif', icon: Settings },
    { value: 'project', label: 'Projet', icon: Edit3 }
  ];

  const addNewModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: 'Nouveau module',
      type: 'text',
      content: '',
      duration: 15,
      order: modules.length + 1,
      isPublished: false,
      resources: []
    };
    
    setModules([...modules, newModule]);
    setSelectedModule(newModule);
    setIsEditing(true);
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, ...updates } : module
    ));
    
    if (selectedModule?.id === moduleId) {
      setSelectedModule({ ...selectedModule, ...updates });
    }
  };

  const deleteModule = (moduleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      setModules(modules.filter(module => module.id !== moduleId));
      if (selectedModule?.id === moduleId) {
        setSelectedModule(null);
        setIsEditing(false);
      }
      toast({
        title: "Module supprimé",
        description: "Le module a été supprimé avec succès",
      });
    }
  };

  const moveModule = (moduleId: string, direction: 'up' | 'down') => {
    const currentIndex = modules.findIndex(m => m.id === moduleId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === modules.length - 1)
    ) {
      return;
    }

    const newModules = [...modules];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newModules[currentIndex], newModules[targetIndex]] = [newModules[targetIndex], newModules[currentIndex]];
    
    // Mettre à jour les ordres
    newModules.forEach((module, index) => {
      module.order = index + 1;
    });
    
    setModules(newModules);
  };

  const saveAllModules = () => {
    onSave(modules);
    toast({
      title: "Contenu sauvegardé",
      description: "Tous les modules ont été sauvegardés avec succès",
    });
  };

  const generateAIContent = async (moduleType: string, topic: string) => {
    if (!selectedModule) return;

    try {
      // Simulation de génération IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let generatedContent = '';
      
      switch (moduleType) {
        case 'text':
          generatedContent = `# ${topic}

## Introduction

Ce module explore en détail le sujet de ${topic} dans le contexte africain. Nous allons aborder les concepts clés, les applications pratiques et les exemples concrets.

## Concepts Fondamentaux

${topic} représente un domaine crucial pour le développement en Afrique. Les principes de base incluent :

- **Principe 1**: Adaptation au contexte local
- **Principe 2**: Solutions innovantes et durables
- **Principe 3**: Impact communautaire positif
- **Principe 4**: Accessibilité et inclusion

## Applications Pratiques

### Exemples Concrets

1. **Cas d'usage 1**: Application dans l'agriculture
2. **Cas d'usage 2**: Implementation dans l'éducation
3. **Cas d'usage 3**: Utilisation dans la santé

### Exercices Pratiques

Complétez les activités suivantes pour mieux comprendre ${topic} :

- [ ] Analysez un cas concret de votre région
- [ ] Identifiez les opportunités d'application
- [ ] Proposez une solution adaptée

## Conclusion

${topic} offre de nombreuses opportunités pour améliorer les conditions de vie en Afrique. La clé du succès réside dans l'adaptation locale et l'engagement communautaire.

---
*Temps estimé : ${selectedModule.duration} minutes*`;
          break;
          
        case 'quiz':
          generatedContent = JSON.stringify({
            questions: [
              {
                id: 1,
                question: `Quel est le principe fondamental de ${topic} ?`,
                type: 'multiple',
                options: [
                  'Adaptation au contexte local',
                  'Application universelle',
                  'Complexité technique',
                  'Coût élevé'
                ],
                correctAnswer: 0,
                explanation: 'L\'adaptation au contexte local est essentielle pour le succès en Afrique.'
              },
              {
                id: 2,
                question: `${topic} peut-il être appliqué dans tous les secteurs ?`,
                type: 'true_false',
                options: ['Vrai', 'Faux'],
                correctAnswer: 0,
                explanation: 'Avec les bonnes adaptations, les principes peuvent s\'appliquer largement.'
              }
            ],
            timeLimit: 15,
            passingScore: 70
          }, null, 2);
          break;
          
        default:
          generatedContent = `Contenu généré par IA pour le module ${topic} de type ${moduleType}.`;
      }

      updateModule(selectedModule.id, { content: generatedContent });
      
      toast({
        title: "Contenu généré !",
        description: "Le contenu IA a été ajouté au module",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu IA",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Edit3 className="h-6 w-6" />
              <span>Éditeur de Contenu Avancé</span>
            </span>
            <div className="flex items-center space-x-2">
              <Switch
                checked={previewMode}
                onCheckedChange={setPreviewMode}
                id="preview-mode"
              />
              <Label htmlFor="preview-mode">Aperçu</Label>
              <Button onClick={saveAllModules} className="ml-4">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder Tout
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des modules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Modules ({modules.length})</h3>
                <Button onClick={addNewModule} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {modules.map((module, index) => (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer transition-colors ${
                      selectedModule?.id === module.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedModule(module)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {moduleTypes.find(t => t.value === module.type)?.icon && 
                              React.createElement(moduleTypes.find(t => t.value === module.type)!.icon, { 
                                className: "h-4 w-4" 
                              })
                            }
                            <span className="font-medium text-sm">{module.title}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {moduleTypes.find(t => t.value === module.type)?.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {module.duration}min
                            </Badge>
                            {module.isPublished && (
                              <Badge variant="default" className="text-xs">Publié</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveModule(module.id, 'up');
                            }}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveModule(module.id, 'down');
                            }}
                            disabled={index === modules.length - 1}
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Éditeur de module */}
            <div className="lg:col-span-2">
              {selectedModule ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Édition: {selectedModule.title}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteModule(selectedModule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Tabs defaultValue="content" className="space-y-4">
                        <TabsList>
                          <TabsTrigger value="content">Contenu</TabsTrigger>
                          <TabsTrigger value="settings">Paramètres</TabsTrigger>
                          <TabsTrigger value="resources">Ressources</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="module-title">Titre</Label>
                              <Input
                                id="module-title"
                                value={selectedModule.title}
                                onChange={(e) => updateModule(selectedModule.id, { title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="module-type">Type</Label>
                              <Select 
                                value={selectedModule.type} 
                                onValueChange={(value) => updateModule(selectedModule.id, { type: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {moduleTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor="module-content">Contenu</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generateAIContent(selectedModule.type, selectedModule.title)}
                              >
                                ✨ Générer avec IA
                              </Button>
                            </div>
                            <Textarea
                              id="module-content"
                              value={selectedModule.content}
                              onChange={(e) => updateModule(selectedModule.id, { content: e.target.value })}
                              rows={12}
                              placeholder="Contenu du module..."
                            />
                          </div>

                          {selectedModule.type === 'video' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="video-url">URL Vidéo</Label>
                                <Input
                                  id="video-url"
                                  value={selectedModule.videoUrl || ''}
                                  onChange={(e) => updateModule(selectedModule.id, { videoUrl: e.target.value })}
                                  placeholder="https://..."
                                />
                              </div>
                              <div>
                                <Label htmlFor="thumbnail-url">Miniature</Label>
                                <Input
                                  id="thumbnail-url"
                                  value={selectedModule.thumbnailUrl || ''}
                                  onChange={(e) => updateModule(selectedModule.id, { thumbnailUrl: e.target.value })}
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="duration">Durée (minutes)</Label>
                              <Input
                                id="duration"
                                type="number"
                                value={selectedModule.duration}
                                onChange={(e) => updateModule(selectedModule.id, { duration: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="order">Ordre</Label>
                              <Input
                                id="order"
                                type="number"
                                value={selectedModule.order}
                                onChange={(e) => updateModule(selectedModule.id, { order: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="published"
                              checked={selectedModule.isPublished}
                              onCheckedChange={(checked) => updateModule(selectedModule.id, { isPublished: checked })}
                            />
                            <Label htmlFor="published">Module publié</Label>
                          </div>
                        </TabsContent>

                        <TabsContent value="resources" className="space-y-4">
                          <div>
                            <Label>Ressources additionnelles</Label>
                            <div className="space-y-2 mt-2">
                              {selectedModule.resources?.map((resource, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    value={resource}
                                    onChange={(e) => {
                                      const newResources = [...(selectedModule.resources || [])];
                                      newResources[index] = e.target.value;
                                      updateModule(selectedModule.id, { resources: newResources });
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newResources = selectedModule.resources?.filter((_, i) => i !== index);
                                      updateModule(selectedModule.id, { resources: newResources });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const newResources = [...(selectedModule.resources || []), ''];
                                  updateModule(selectedModule.id, { resources: newResources });
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter une ressource
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="prose max-w-none">
                        <h3>{selectedModule.title}</h3>
                        {selectedModule.type === 'quiz' ? (
                          <div>
                            <h4>Aperçu du Quiz</h4>
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                              {selectedModule.content}
                            </pre>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{selectedModule.content}</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center text-gray-500">
                      <Edit3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Sélectionnez un module pour commencer l'édition</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
