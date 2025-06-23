
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Star } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_minutes: number;
  is_premium: boolean;
  price_fcfa: number;
  thumbnail_url: string;
  video_url: string;
}

interface VideoCardProps {
  course: Course;
}

export const VideoCard = ({ course }: VideoCardProps) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
  };

  const handleClick = () => {
    // TODO: Navigate to course viewer
    console.log('Opening course:', course.id);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-black/20"></div>
              <h3 className="text-white text-lg font-bold text-center px-4 relative z-10">
                {course.title}
              </h3>
            </>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(course.duration_minutes)}
          </div>
          
          {/* Premium Badge */}
          {course.is_premium && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <Star className="h-3 w-3" />
              Premium
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="bg-blue-600 rounded-full p-4 transform scale-100 group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h4>
          
          {course.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {course.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.duration_minutes)}</span>
            </div>
            
            {course.is_premium && (
              <div className="text-sm font-semibold text-blue-600">
                {course.price_fcfa} FCFA
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
