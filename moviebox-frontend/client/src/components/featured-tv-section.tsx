import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TvShow } from "@/lib/types";

interface FeaturedTvSectionProps {
  show: TvShow;
}

export default function FeaturedTvSection({ show }: FeaturedTvSectionProps) {
  return (
    <section className="relative py-8 md:py-12 bg-card rounded-xl overflow-hidden mx-4 lg:mx-8 my-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={show.backdropPath} 
          alt={show.title} 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-4 bg-accent text-accent-foreground">
              NEW SEASON
            </Badge>
            
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">{show.title}</h2>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-sm font-medium">{show.voteAverage}</span>
              </div>
              <span className="text-sm text-foreground/70">{show.firstAirDate?.substring(0, 4)}-Present</span>
              <span className="text-sm bg-foreground/10 px-2 py-0.5 rounded">{show.rating || "TV-14"}</span>
            </div>
            
            <p className="text-foreground/80 text-sm md:text-base mb-6">
              {show.overview}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="gap-2" size="lg">
                <Play className="h-4 w-4" /> Watch Now
              </Button>
              <Button variant="secondary" className="gap-2" size="lg">
                <Plus className="h-4 w-4" /> Add to List
              </Button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-end">
            <div className="relative">
              {/* TV Show poster */}
              <img 
                src={show.posterPath} 
                alt={`${show.title} poster`} 
                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm">
                New Season
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
