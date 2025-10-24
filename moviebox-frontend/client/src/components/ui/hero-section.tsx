import { useLocation } from "wouter";
import { Star, Play, Info, Plus, Check } from "lucide-react";
import { Button } from "./button";
import { HeroSectionProps } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent } from "./dialog";
import { useToast } from "@/hooks/use-toast";

const HeroSection = ({
  id,
  title,
  overview,
  backdropPath,
  releaseYear,
  duration,
  rating,
  voteAverage,
  mediaType,
}: HeroSectionProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  // Temporarily set user to null until auth is fixed
  const user = null;
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Temporarily disable watchlist functionality
  const isInWatchlist = false;

  const handleWatchlistToggle = () => {
    // Redirect to auth page for now
    navigate('/auth');
  };

  // Format duration
  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backdropPath || 'https://via.placeholder.com/1920x1080?text=No+Image'} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/1920x1080?text=No+Image';
          }}
        />
        <div className="absolute inset-0 hero-overlay"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white mb-4">
            FEATURED
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4">{title}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <Star className="text-secondary mr-1 h-5 w-5 fill-secondary" />
              <span className="text-sm font-medium">{voteAverage}</span>
            </div>
            <span className="text-sm text-foreground/70">{releaseYear}</span>
            {duration && <span className="text-sm text-foreground/70">{formatDuration(duration)}</span>}
            {rating && <span className="text-sm bg-foreground/10 px-2 py-0.5 rounded">{rating}</span>}
          </div>
          
          <p className="text-foreground/80 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3">
            {overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white" 
              onClick={() => setTrailerOpen(true)}
            >
              <Play className="h-5 w-5" /> Play
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-secondary text-secondary hover:bg-secondary/10"
              onClick={() => navigate(`/${mediaType}/${id}`)}
            >
              <Info className="h-5 w-5" /> More Info
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex items-center justify-center w-12 h-12 bg-foreground/10 hover:bg-primary/20 text-primary rounded-full backdrop-blur-sm transition-colors"
              onClick={handleWatchlistToggle}
            >
              {isInWatchlist ? (
                <Check className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="max-w-4xl w-full p-1 bg-black">
          <div className="relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white">Trailer would be embedded here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
