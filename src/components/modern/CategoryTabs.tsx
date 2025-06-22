
import React from 'react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  'Motivation',
  'Éducation financière', 
  'Technologie',
  'Apprentissage mobile'
];

export const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
            activeCategory === category 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
