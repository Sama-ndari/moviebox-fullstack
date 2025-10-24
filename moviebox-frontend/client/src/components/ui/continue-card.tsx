import { Button } from "@/components/ui/button";
import { Play, Info, MoreHorizontal } from "lucide-react";
import { WatchHistoryItem } from "@/lib/types";
import { Link } from "wouter";

interface ContinueCardProps {
  item: WatchHistoryItem;
}

export default function ContinueCard({ item }: ContinueCardProps) {
  // Calculate progress percentage
  const progressPercent = item.progress && item.duration 
    ? Math.round((item.progress / item.duration) * 100)
    : 0;

  // Format time remaining
  const formatTimeRemaining = () => {
    if (!item.progress || !item.duration) return "00:00";
    
    const remaining = item.duration - item.progress;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-shrink-0 w-60 md:w-72 rounded-lg overflow-hidden bg-card">
      <div className="relative">
        <img 
          src={item.content?.backdropPath} 
          alt={item.content?.title} 
          className="w-full h-32 md:h-40 object-cover"
        />
        <Link href={`/${item.itemType}/${item.itemId}`}>
          <a className="absolute bottom-3 right-3">
            <Button size="icon" className="h-10 w-10 rounded-full">
              <Play className="h-5 w-5" />
            </Button>
          </a>
        </Link>
        <div className="absolute top-3 right-3 bg-black/60 text-xs rounded px-1.5 py-0.5">
          {formatTimeRemaining()}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm md:text-base mb-1">{item.content?.title}</h3>
        <div className="flex items-center text-xs text-foreground/70 mb-3">
          {item.itemType === "tv" && item.episode ? (
            <span>S{item.episode.season}:E{item.episode.number} "{item.episode.title}"</span>
          ) : (
            <span>{item.content?.releaseDate} • {Math.floor((item.duration || 0) / 60)}m</span>
          )}
        </div>
        
        <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-3">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="text-xs rounded-full h-7">
            Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
