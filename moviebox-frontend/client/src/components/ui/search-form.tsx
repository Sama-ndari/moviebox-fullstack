import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

interface SearchFormProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchForm = ({ onSearch, initialQuery = "" }: SearchFormProps) => {
  const [query, setQuery] = useState(initialQuery);

  // Update local state when initialQuery prop changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search for movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-l-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <Button 
          type="submit" 
          className="rounded-l-none"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>
      
      {/* Search Suggestions - would be populated from API in a real implementation */}
      {query.trim().length > 2 && (
        <div className="hidden absolute left-0 right-0 top-full mt-2 bg-card rounded-lg shadow-xl p-2 z-50">
          <p className="text-xs text-muted-foreground p-2">Loading suggestions...</p>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
