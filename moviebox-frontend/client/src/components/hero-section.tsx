import { Button } from "@/components/ui/button";
import { Play, Info, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Movie, TvShow } from "@/lib/types";

interface HeroSectionProps {
  item: Movie | TvShow;
  type: "movie" | "tv";
}

export default function HeroSection({ item, type }: HeroSectionProps) {
  const { user } = useAuth();
  
  if (!item) return null;

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={item.backdropPath} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <Badge className="mb-4 bg-primary text-primary-foreground">
            FEATURED
          </Badge>
          
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4">{item.title}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-sm font-medium">{item.voteAverage}</span>
            </div>
            <span className="text-sm text-foreground/70">{type === "movie" ? (item as Movie).releaseDate?.substring(0, 4) : `${(item as TvShow).firstAirDate?.substring(0, 4)}-Present`}</span>
            {type === "movie" && (item as Movie).runtime && (
              <span className="text-sm text-foreground/70">{Math.floor((item as Movie).runtime / 60)}h {(item as Movie).runtime % 60}m</span>
            )}
            <span className="text-sm bg-foreground/10 px-2 py-0.5 rounded">{item.rating || "PG-13"}</span>
          </div>
          
          <p className="text-foreground/80 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3">
            {item.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="gap-2" size="lg">
              <Play className="h-4 w-4" /> Play
            </Button>
            <Button variant="secondary" className="gap-2" size="lg">
              <Info className="h-4 w-4" /> More Info
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
