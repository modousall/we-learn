
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Star, Users, Lock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_minutes: number;
  is_premium: boolean;
  price_fcfa: number;
  thumbnail_url?: string;
}

interface CourseCardProps {
  course: Course;
  progress: number;
  onEnroll: () => void;
}

export const CourseCard = ({ course, progress, onEnroll }: CourseCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'finance':
        return 'bg-green-100 text-green-800';
      case 'technology':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debutant':
        return 'bg-yellow-100 text-yellow-800';
      case 'intermediaire':
        return 'bg-orange-100 text-orange-800';
      case 'essentiel':
        return 'bg-red-100 text-red-800';
      case 'avance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex space-x-2">
            <Badge className={getCategoryColor(course.category)}>
              {course.category === 'finance' ? 'Finance' : 'Technologie'}
            </Badge>
            <Badge className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>
          {course.is_premium && (
            <div className="flex items-center text-amber-600">
              <Lock className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{course.price_fcfa} FCFA</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}min</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>234 élèves</span>
          </div>
        </div>

        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-gray-600 ml-1">(152 avis)</span>
          </div>
          <Button 
            onClick={onEnroll}
            size="sm"
            className="px-4"
          >
            {progress > 0 ? 'Continuer' : 'Commencer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
