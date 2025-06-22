
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Check } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
  completed: boolean;
  timeAgo: string;
}

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20"></div>
          <h3 className="text-white text-lg font-bold text-center px-4 relative z-10">
            {video.title}
          </h3>
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
            {video.duration}
          </div>
          
          {/* Completion Status */}
          <div className="absolute top-3 right-3">
            {video.completed ? (
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            ) : (
              <div className="bg-orange-500 rounded-full p-1">
                <div className="h-4 w-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="bg-red-600 rounded-full p-4 transform scale-100 group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {video.category}
            </Badge>
            <span className="text-xs text-gray-500">{video.timeAgo}</span>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {video.title}
          </h4>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Play className="h-3 w-3" />
            <span>▶</span>
            <span className="text-xs">•</span>
            <span className="text-xs">Posté le {video.timeAgo}</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
