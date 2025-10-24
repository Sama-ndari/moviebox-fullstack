import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Loader2, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCardProps } from '@/types';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { watchlistAPI } from '@/api/watchlist';
import AuthGuard from '@/components/auth/auth-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';

// The watchlist content component
const WatchlistContent = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tvshow'>('all');
  const [sortBy, setSortBy] = useState<'dateAdded' | 'title' | 'rating'>('dateAdded');
  
  // Fetch watchlist
  const { data: watchlistResponse, isLoading: isLoadingWatchlist } = useQuery({
    queryKey: ['watchlist', user?._id],
    queryFn: () => watchlistAPI.getWatchlist(user!._id),
    enabled: !!user,
  });
  const watchlist = watchlistResponse?.data || [];
  
  // Remove from watchlist mutation
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (params: { contentType: string; contentId: string }) => {
      if (!user) return;
      return await watchlistAPI.removeFromWatchlist(params.contentId, params.contentType, user._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
      toast({
        title: 'Removed from watchlist',
        description: 'Item has been removed from your watchlist',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Handle remove from watchlist
  const handleRemoveFromWatchlist = (contentType: string, contentId: string) => {
    removeFromWatchlistMutation.mutate({ contentType, contentId });
  };
  
  // Handle content click
  const handleContentClick = (mediaType: string, id: string) => {
    navigate(`/${mediaType}/${id}`);
  };
  
  // Filter and sort watchlist
  const filteredAndSortedWatchlist = () => {
    let items = [...watchlist];
    
    // Filter by type
    if (filterType !== 'all') {
      items = items.filter((item: any) => item.contentType?.toLowerCase() === filterType);
    }
    
    // Sort
    if (sortBy === 'title') {
      items.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'rating') {
      items.sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sortBy === 'dateAdded') {
      items.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    
    return items;
  };
  
  // Loading state
  if (isLoadingWatchlist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const processedWatchlist = filteredAndSortedWatchlist();
  
  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">My Watchlist ({processedWatchlist.length})</h1>
          
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tvshow">TV Shows</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">Date Added</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {processedWatchlist && processedWatchlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {processedWatchlist.map((item: any) => (
              <div 
                key={`${item.mediaType}-${item.id}`} 
                className="bg-card rounded-lg overflow-hidden"
              >
                <div 
                  className="relative cursor-pointer"
                  onClick={() => handleContentClick(item.mediaType, item.id)}
                >
                  <img
                    src={item.posterPath}
                    alt={item.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-24 card-overlay px-3 py-3 flex flex-col justify-end">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-xs mr-1">★</span>
                        <span className="text-xs">{item.voteAverage}</span>
                      </div>
                      <span className="mx-2 text-xs text-white/50">•</span>
                      <span className="text-xs text-white/50">{item.releaseYear}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {item.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWatchlist(item.mediaType, item.id)}
                    disabled={removeFromWatchlistMutation.isPending}
                    className="text-muted-foreground hover:text-destructive hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Loader2}
            title="Your watchlist is empty"
            description="Start adding movies and TV shows to your watchlist to keep track of what you want to watch"
            actionLabel="Browse Content"
            onAction={() => navigate('/browse')}
          />
        )}
      </div>
    </div>
  );
};

// Export a new component that wraps the content in AuthGuard 
export default function WatchlistPage() {
  // AuthGuard removed for unauthenticated access
  return <WatchlistContent />;
}
