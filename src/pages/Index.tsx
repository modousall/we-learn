
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Shield, Zap, Users, Award, Globe, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [language, setLanguage] = useState("fr");

  const handleCourseClick = (courseTitle: string) => {
    toast(`Bienvenue dans le cours : ${courseTitle}`, {
      description: "Cette fonctionnalité sera bientôt disponible !",
      duration: 3000,
    });
  };

  const coursesFinance = [
    {
      title: "Connaître sa monnaie (FCFA)",
      description: "Comprendre l'inflation, les taux de change et l'économie locale",
      duration: "2h 30min",
      level: "Débutant",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      color: "from-green-400 to-green-600"
    },
    {
      title: "Gérer son argent au quotidien",
      description: "Épargne, budget, gestion des dettes - méthodes pratiques",
      duration: "3h 15min",
      level: "Intermédiaire",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Services financiers africains",
      description: "Banques, fintech, microfinance, Orange Money, Wave",
      duration: "2h 45min",
      level: "Débutant",
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Éviter les arnaques financières",
      description: "Reconnaissance et prévention des fraudes financières",
      duration: "1h 30min",
      level: "Essentiel",
      icon: <Shield className="w-6 h-6 text-red-600" />,
      color: "from-red-400 to-red-600"
    }
  ];

  const coursesTech = [
    {
      title: "IA au quotidien en Afrique",
      description: "Applications pratiques de l'intelligence artificielle",
      duration: "2h 15min",
      level: "Débutant",
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      title: "Blockchain & Crypto simplifiées",
      description: "Comprendre la blockchain et les cryptomonnaies",
      duration: "3h 00min",
      level: "Intermédiaire",
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      color: "from-indigo-400 to-indigo-600"
    },
    {
      title: "Sécurité numérique",
      description: "Protection de l'identité et sécurité en ligne",
      duration: "2h 30min",
      level: "Essentiel",
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      color: "from-emerald-400 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AfriLearn</h1>
                <p className="text-xs text-gray-600">Smart Future</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "fr" ? "wo" : "fr")}>
                {language === "fr" ? "🇸🇳 Wolof" : "🇫🇷 Français"}
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            🌍 Éducation financière & technologique pour l'Afrique
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Préparez votre 
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> avenir digital</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Maîtrisez les finances personnelles et les nouvelles technologies adaptées au contexte africain. 
            De l'épargne en FCFA à l'IA, construisez votre réussite !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-3">
              Commencer gratuitement
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-2">
              Découvrir les cours
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">10K+</div>
            <div className="text-sm text-gray-600">Étudiants actifs</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-sm text-gray-600">Cours disponibles</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-sm text-gray-600">Taux de réussite</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-600">Pays UEMOA</div>
          </div>
        </div>
      </section>

      {/* Courses Section - Finances */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            💰 Finances personnelles
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Maîtrisez votre argent avec des méthodes adaptées à l'économie africaine
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {coursesFinance.map((course, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => handleCourseClick(course.title)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center mb-3`}>
                  {course.icon}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">{course.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {course.level}
                  </Badge>
                  <span className="text-xs text-gray-500">{course.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses Section - Technologies */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🚀 Nouvelles Technologies
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Découvrez l'IA, la blockchain et la sécurité numérique en toute simplicité
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesTech.map((course, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => handleCourseClick(course.title)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center mb-3`}>
                  {course.icon}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">{course.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {course.level}
                  </Badge>
                  <span className="text-xs text-gray-500">{course.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez la révolution éducative africaine !
          </h3>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Accédez à des cours gratuits et premium, avec paiement par Orange Money, Wave et cartes bancaires
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-3 font-semibold">
            Créer mon compte gratuit
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">AfriLearn Smart Future</span>
              </div>
              <p className="text-gray-400 text-sm">
                L'éducation financière et technologique pour l'Afrique de demain
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Cours</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Finances personnelles</li>
                <li>Nouvelles technologies</li>
                <li>Certificats</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Communauté</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Forum étudiants</li>
                <li>Événements</li>
                <li>Partenaires</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Support 24/7</li>
                <li>contact@afrilearn.com</li>
                <li>🌍 Zone UEMOA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AfriLearn Smart Future. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
