import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/ui/movie-card";
import { Movie, TvShow } from "@/lib/types";
import { Link } from "wouter";

interface ContentRowProps {
  title: string;
  items: (Movie | TvShow)[];
  type: "movie" | "tv";
  viewAllLink?: string;
}

export default function ContentRow({ title, items, type, viewAllLink }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollTo = direction === "left" 
      ? scrollLeft - clientWidth 
      : scrollLeft + clientWidth;
    
    rowRef.current.scrollTo({
      left: scrollTo,
      behavior: "smooth"
    });
  };
  
  const handleScroll = () => {
    if (!rowRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl md:text-2xl">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button variant="link" className="text-sm text-foreground/70 hover:text-foreground">
                See All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        
        <div className="relative">
          <div 
            ref={rowRef}
            className="content-row relative -mx-4 px-4 overflow-x-auto pb-4 flex space-x-4"
            onScroll={handleScroll}
          >
            {items.map((item) => (
              <MovieCard 
                key={item.id}
                item={item}
                type={type}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          {showLeftArrow && (
            <Button 
              variant="secondary"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm z-10 opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          {showRightArrow && (
            <Button 
              variant="secondary"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm z-10 opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
