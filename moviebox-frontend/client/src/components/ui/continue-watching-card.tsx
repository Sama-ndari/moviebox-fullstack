import { useLocation } from "wouter";
import { Play, Info, MoreHorizontal } from "lucide-react";
import { ContinueWatchingItem } from "@/types";
import { Button } from "./button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const ContinueWatchingCard = ({
  id,
  title,
  posterPath,
  contentId,
  contentType,
  progress,
  totalDuration,
  episodeInfo,
}: ContinueWatchingItem) => {
  const [, navigate] = useLocation();

  // Calculate progress percentage
  const progressPercentage = Math.round((progress / totalDuration) * 100);

  // Update watch progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('PATCH', `/api/watch-history/${id}`, {
        progress: progress,
        completed: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watch-history'] });
      navigate(`/${contentType}/${contentId}`);
    }
  });

  const handleResume = () => {
    updateProgressMutation.mutate();
  };

  const handleCardClick = () => {
    navigate(`/${contentType}/${contentId}`);
  };

  // Format time remaining
  const formatTimeRemaining = () => {
    const secondsRemaining = totalDuration - progress;
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = Math.floor(secondsRemaining % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-shrink-0 w-60 md:w-72 rounded-lg overflow-hidden bg-card">
      <div className="relative">
        <img 
          src={posterPath} 
          alt={title} 
          className="w-full h-32 md:h-40 object-cover cursor-pointer"
          onClick={handleCardClick}
        />
        <div className="absolute bottom-3 right-3">
          <Button
            variant="default"
            size="icon"
            className="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-lg"
            onClick={handleResume}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-xs rounded px-1.5 py-0.5">
          {formatTimeRemaining()}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm md:text-base mb-1">{title}</h3>
        <div className="flex items-center text-xs text-foreground/70 mb-3">
          <span>{episodeInfo || `${contentType === 'movie' ? 'Movie' : 'TV Show'}`}</span>
        </div>
        
        <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-3">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs bg-muted hover:bg-muted/80 px-3 py-1 rounded-full transition-colors"
            onClick={handleResume}
            disabled={updateProgressMutation.isPending}
          >
            Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingCard;
