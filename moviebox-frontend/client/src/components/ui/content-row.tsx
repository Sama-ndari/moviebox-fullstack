import { useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentCardProps } from "@/types";
import MovieCard from "./movie-card";
import { Button } from "./button";

interface ContentRowProps {
  title: string;
  items: ContentCardProps[];
  seeAllLink?: string;
}

const ContentRow = ({ title, items, seeAllLink }: ContentRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -current.offsetWidth * 0.75 : current.offsetWidth * 0.75;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="nexify-section-title nexify-gradient-text">{title}</h2>
        {seeAllLink && (
          <Link href={seeAllLink} className="flex items-center text-sm text-secondary hover:text-primary transition-colors">
            See All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="relative">
        <div 
          ref={scrollRef} 
          className="content-row relative -mx-4 px-4 overflow-x-auto pb-4 flex space-x-4 scrollbar-hide"
        >
          {items.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="flex-shrink-0 w-36 md:w-48">
              <MovieCard {...item} />
            </div>
          ))}
        </div>

        {items.length > 4 && (
          <>
            <Button
              onClick={() => scroll("left")}
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 hover:opacity-100 transition-opacity focus:outline-none z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={() => scroll("right")}
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 hover:opacity-100 transition-opacity focus:outline-none z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentRow;
