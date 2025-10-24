import { useState, useRef, useEffect } from "react";
import { useNavigate } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Movie, TvShow } from "@/lib/types";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search results if query is at least 3 characters
  const { data: searchResults } = useQuery<(Movie | TvShow)[]>({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length >= 3,
    staleTime: 10000,
  });

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when opening search
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-foreground/70 hover:text-foreground transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-card rounded-lg shadow-xl p-4 transform origin-top-right transition-all z-50">
          <form onSubmit={handleSearch} className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for movies, TV shows..."
              className="w-full bg-muted pr-8 rounded text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-foreground/50" />
          </form>
          
          {searchQuery.length >= 3 && searchResults && searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-foreground/50">Popular Searches</p>
              {searchResults.slice(0, 3).map((result) => (
                <div 
                  key={`${result.id}-${result.title}`}
                  className="flex items-center p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => {
                    // Determine if it's a movie or TV show and navigate accordingly
                    const type = 'releaseDate' in result ? 'movie' : 'tv';
                    navigate(`/${type}/${result.id}`);
                    setIsOpen(false);
                  }}
                >
                  <img 
                    src={result.posterPath}
                    alt={result.title} 
                    className="w-8 h-12 object-cover rounded mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="text-xs text-foreground/50">
                      {'releaseDate' in result 
                        ? `${result.releaseDate?.substring(0, 4)} • Movie` 
                        : `${result.firstAirDate?.substring(0, 4)} • TV Series`}
                    </p>
                  </div>
                </div>
              ))}
              
              {searchResults.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-sm justify-center mt-2"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setIsOpen(false);
                  }}
                >
                  View all results
                </Button>
              )}
            </div>
          )}
          
          {searchQuery.length >= 3 && (!searchResults || searchResults.length === 0) && (
            <div className="mt-4 text-center py-2">
              <p className="text-sm text-foreground/70">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
