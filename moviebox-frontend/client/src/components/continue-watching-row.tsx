import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContinueCard from "@/components/ui/continue-card";
import { WatchHistoryItem } from "@/lib/types";

interface ContinueWatchingRowProps {
  items: WatchHistoryItem[];
}

export default function ContinueWatchingRow({ items }: ContinueWatchingRowProps) {
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
          <h2 className="font-heading font-bold text-xl md:text-2xl">Continue Watching</h2>
        </div>
        
        <div className="relative">
          <div 
            ref={rowRef}
            className="content-row relative -mx-4 px-4 overflow-x-auto pb-4 flex space-x-4"
            onScroll={handleScroll}
          >
            {items.map((item) => (
              <ContinueCard 
                key={item.id}
                item={item}
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
