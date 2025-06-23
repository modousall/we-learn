
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categories = [
  'all',
  'Éducation financière', 
  'Technologie',
  'Motivation'
];

export const CategoryTabs =({ selectedCategory, onCategoryChange, searchTerm, onSearchChange }: CategoryTabsProps) => {
  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher un cours..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              selectedCategory === category 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {category === 'all' ? 'Tous' : category}
          </Button>
        ))}
      </div>
    </div>
  );
};
