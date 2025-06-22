
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCard } from './VideoCard';
import { CategoryTabs } from './CategoryTabs';
import { Header } from './Header';
import { Search, BookOpen } from 'lucide-react';

interface ModernDashboardProps {
  user: User;
}

const mockVideos = [
  {
    id: '1',
    title: '5 minutes qui changent une vie',
    duration: '0:54',
    thumbnail: '/lovable-uploads/cd9ba343-6bed-48c6-8a8a-12a8debf8dbd.png',
    category: 'Motivation',
    completed: true,
    timeAgo: 'il y a 1 jour'
  },
  {
    id: '2',
    title: 'Épargne 1000 FCFA par semaine',
    duration: '1:00',
    thumbnail: '/lovable-uploads/cd9ba343-6bed-48c6-8a8a-12a8debf8dbd.png',
    category: 'Éducation financière',
    completed: true,
    timeAgo: 'il y a 2 jours'
  },
  {
    id: '3',
    title: "L'IA expliquée en 60 secondes",
    duration: '1:01',
    thumbnail: '/lovable-uploads/cd9ba343-6bed-48c6-8a8a-12a8debf8dbd.png',
    category: 'Technologie',
    completed: false,
    timeAgo: 'il y a 3 jours'
  },
  {
    id: '4',
    title: 'Ton smartphone, ton école',
    duration: '0:45',
    thumbnail: '/lovable-uploads/cd9ba343-6bed-48c6-8a8a-12a8debf8dbd.png',
    category: 'Apprentissage mobile',
    completed: false,
    timeAgo: 'il y a 1 semaine'
  }
];

export const ModernDashboard = ({ user }: ModernDashboardProps) => {
  const [activeCategory, setActiveCategory] = useState('Motivation');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const filteredVideos = mockVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryVideos = activeCategory === 'Tous' 
    ? filteredVideos 
    : filteredVideos.filter(video => video.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 mr-4 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">WeLearn</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Vidéo éducatives et motivantes pour les jeunes
          </p>
          
          {/* Category Tabs */}
          <CategoryTabs 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full border-2 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => console.log('Playing video:', video.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {categoryVideos.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Aucune vidéo trouvée
            </h3>
            <p className="text-gray-400">
              Essayez un autre terme de recherche ou une autre catégorie
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
