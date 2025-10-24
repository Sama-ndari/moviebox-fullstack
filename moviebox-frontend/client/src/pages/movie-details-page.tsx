import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Play, Plus, Check, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCardProps, MediaType } from '@/types';
import ContentRow from '@/components/ui/content-row';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { moviesAPI, Movie } from '@/api/movies';
import { tvShowsAPI, TVShow } from '@/api/tvshows';
import { watchlistAPI } from '@/api/watchlist';
import { reviewsAPI } from '@/api/reviews';
import { useAuth } from '@/hooks/use-auth';
import { RatingComponent } from '@/components/ui/rating-component';
import { CastCrewSection } from '@/components/ui/cast-crew-section';

const MovieDetailsPage = () => {
  const [, params] = useRoute('/:type/:id');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const typeParam = params?.type;
  const idParam = params?.id;
  const contentType = typeParam === 'movie' ? 'movie' : (typeParam === 'tvshow' ? 'tvshow' : undefined);
  const contentId = idParam;

  if (!contentType || !contentId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid content URL</h1>
        <Button onClick={() => navigate('/browse')}>
          Browse Content
        </Button>
      </div>
    );
  }
  
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  // Fetch content details based on type
  const { 
    data: contentResponse, 
    isLoading: isLoadingContent, 
    isError: isErrorContent, 
    error: errorContent 
  } = useQuery({
    queryKey: [contentType === 'movie' ? 'movie' : 'tvshow', contentId],
    queryFn: async () => {
      if (contentType === 'movie') {
        return await moviesAPI.getById(contentId!);
      } else {
        return await tvShowsAPI.getById(contentId!);
      }
    },
    enabled: !!contentId && !!contentType,
  });
  const content = contentResponse?.data;
  
  // Fetch similar/recommended content using backend recommendations endpoint
  const {
    data: similarResponse,
    isLoading: isLoadingSimilar
  } = useQuery({
    queryKey: [contentType === 'movie' ? 'movie-recommendations' : 'tvshow-recommendations', contentId],
    queryFn: async () => {
      if (contentType === 'movie') {
        return await moviesAPI.getRecommendations(contentId!, 6);
      } else {
        return await tvShowsAPI.getRecommendations(contentId!, 6);
      }
    },
    enabled: !!contentId && !!contentType,
  });
  const similarContent = similarResponse?.data || [];
  
  // Fetch cast & crew (only for movies)
  const { data: castResponse } = useQuery({
    queryKey: ['movie-cast', contentId],
    queryFn: () => moviesAPI.getCast(contentId!),
    enabled: !!contentId && contentType === 'movie',
  });
  const cast = Array.isArray(castResponse?.data) ? castResponse.data : [];
  
  const { data: crewResponse } = useQuery({
    queryKey: ['movie-crew', contentId],
    queryFn: () => moviesAPI.getCrew(contentId!),
    enabled: !!contentId && contentType === 'movie',
  });
  const crew = Array.isArray(crewResponse?.data) ? crewResponse.data : [];
  
  // Fetch reviews
  const { data: reviewsResponse } = useQuery({
    queryKey: ['reviews', contentType, contentId],
    queryFn: () => reviewsAPI.getByTarget(contentId!, contentType),
    enabled: !!contentId && !!contentType,
  });
  const reviews = reviewsResponse?.data || [];
  
  // --- WATCHLIST LOGIC (correct backend endpoints) ---
  // Fetch user watchlist
  const { data: watchlistResponse, isLoading: isLoadingWatchlist } = useQuery({
    queryKey: ['watchlist', user?._id],
    queryFn: async () => {
      if (!user) return { data: [] };
      return await watchlistAPI.getWatchlist(user._id);
    },
    enabled: !!user,
  });
  const watchlist: any[] = watchlistResponse?.data || [];
  const isInWatchlist = watchlist.some((item: any) =>
    item.contentId === contentId &&
    item.contentType?.toLowerCase() === contentType
  );

  // Add to watchlist mutation (POST /watchlist/:userId)
  const addToWatchlistMutation = useMutation({
    mutationFn: async (payload: { notes?: string; priority?: string }) => {
      if (!user || !content) return;
      return await watchlistAPI.addToWatchlist(
        user._id,
        content._id,
        contentType as 'movie' | 'tvshow',
        payload.priority,
        payload.notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?._id] });
      toast({
        title: 'Added to watchlist',
        description: `${content?.title} has been added to your watchlist`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Remove from watchlist mutation (DELETE /watchlist/:contentId/:contentType/:userId)
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (!user || !content) return;
      return await watchlistAPI.removeFromWatchlist(
        content._id,
        contentType,
        user._id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?._id] });
      toast({
        title: 'Removed from watchlist',
        description: `${content?.title} has been removed from your watchlist`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle add/remove from watchlist
  const handleWatchlistToggle = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (isInWatchlist) {
      removeFromWatchlistMutation.mutate();
    } else {
      addToWatchlistMutation.mutate({});
    }
  };
  
  // Filter similar content (different from current content)
  const filteredSimilarContent = Array.isArray(similarContent)
    ? similarContent
        .filter((item: any) => String(item._id || item.id) !== String(contentId))
        .slice(0, 6)
        .map((item: any) => ({
          id: String(item._id),
          title: item.title,
          posterPath: item.posterUrl,
          releaseYear: (item.releaseDate ? new Date(item.releaseDate).getFullYear() : undefined),
          voteAverage: item.voteAverage || item.averageRating,
          mediaType: contentType as MediaType
        })) as ContentCardProps[]
    : [];
  
  // Format runtime (for movies)
  const formatRuntime = (minutes?: number | null) => {
    if (!minutes || typeof minutes !== 'number') return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Adapt legacy data to backend attributes if needed
  const adaptMovieData = (data: any) => {
    if (!data) return data;
    return {
      ...data,
      posterUrl: data.posterUrl || data.posterPath,
      backdropUrl: data.backdropUrl || data.backdropPath,
      description: data.description || data.overview,
      // Remove legacy keys to avoid confusion
     
    };
  };

  const adaptedContent = adaptMovieData(content);

  const details = adaptedContent && typeof adaptedContent === 'object' ? {
    id: adaptedContent._id,
    title: adaptedContent.title,
    posterUrl: adaptedContent.posterUrl,
    backdropUrl: adaptedContent.backdropUrl,
    releaseDate: adaptedContent.releaseDate,
    voteAverage: adaptedContent.voteAverage,
    description: adaptedContent.description,
    fullDescription: adaptedContent.fullDescription,
    genres: adaptedContent.genres,
    status: adaptedContent.status,
    trailerUrl: adaptedContent.trailerUrl,
    contentRating: adaptedContent.contentRating,
    reviews: adaptedContent.reviews,
    ratingCount: adaptedContent.ratingCount,
    duration: adaptedContent.duration,
    budget: adaptedContent.budget,
    revenue: adaptedContent.revenue,
    voteCount: adaptedContent.voteCount,
    popularity: adaptedContent.popularity,
    cast: adaptedContent.cast,
    crew: adaptedContent.crew,
    isFeatured: adaptedContent.isFeatured,
    isActive: adaptedContent.isActive,
    streamingUrl: adaptedContent.streamingUrl,
    isAdult: adaptedContent.isAdult,
    languages: adaptedContent.languages,
    country: adaptedContent.country,
    productionCompany: adaptedContent.productionCompany,
    directors: Array.isArray(adaptedContent.directors) ? adaptedContent.directors : [],
    writers: Array.isArray(adaptedContent.writers) ? adaptedContent.writers : [],
    createdAt: typeof adaptedContent.createdAt === 'string' ? adaptedContent.createdAt : undefined,
    updatedAt: typeof adaptedContent.updatedAt === 'string' ? adaptedContent.updatedAt : undefined,
  } : {};
    console.log("AAAAAAAAAAAAA",details);
  // Loading and error state
  if (isLoadingContent || isLoadingWatchlist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  if (isErrorContent) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading content</h1>
        <p className="mb-4 text-muted-foreground">{errorContent?.message || 'An unexpected error occurred.'}</p>
        <Button onClick={() => navigate('/browse')}>
          Browse Content
        </Button>
      </div>
    );
  }
  
  // Content not found
  if (!content) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <Button onClick={() => navigate('/browse')}>
          Browse Content
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Banner */}
      <div className="relative min-h-[70vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={details.backdropUrl || details.posterUrl} 
            alt={details.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img 
                src={details.posterUrl} 
                alt={details.title} 
                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Content details */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{details.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                {typeof details.contentRating === 'string' && details.contentRating && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                    {details.contentRating}
                  </span>
                )}
                {details.releaseDate && <span>{new Date(details.releaseDate).getFullYear()}</span>}
                {typeof details.duration === 'number' && <span>{formatRuntime(details.duration)}</span>}
                {typeof details.status === 'string' && <span>{details.status}</span>}
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{typeof details.voteAverage === 'number' || typeof details.voteAverage === 'string' ? details.voteAverage : ''}</span>
                </div>
              </div>
              
              {/* Genres */}
              {Array.isArray(details.genres) && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.genres.map((genre: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full text-xs shadow-md hover:scale-105 transition-transform duration-150 cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              {/* Description */}
              {(typeof details.description === 'string' && details.description) || (typeof details.fullDescription === 'string' && details.fullDescription) ? (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                  {typeof details.description === 'string' && details.description
                    ? details.description
                    : typeof details.fullDescription === 'string' && details.fullDescription
                    ? details.fullDescription
                    : ''}
                </p>
              ) : null}
              {typeof details.productionCompany === 'string' && details.productionCompany && (
                <div className="mb-2 text-sm">Production: <span className="font-semibold">{details.productionCompany}</span></div>
              )}
              {typeof details.country === 'string' && details.country && (
                <div className="mb-2 text-sm">Country: <span className="font-semibold">{details.country}</span></div>
              )}
              {typeof details.createdAt === 'string' && details.createdAt && (
                <div className="mb-2 text-xs text-muted-foreground">Created: {new Date(details.createdAt).toLocaleDateString()}</div>
              )}
              {typeof details.updatedAt === 'string' && details.updatedAt && (
                <div className="mb-2 text-xs text-muted-foreground">Updated: {new Date(details.updatedAt).toLocaleDateString()}</div>
              )}
              {/* Add more details as needed, e.g. budget, revenue, cast, crew, etc. */}
              {typeof details.budget === 'number' && details.budget > 0 && (
                <div className="mb-2 text-sm">Budget: <span className="font-semibold text-green-600">${details.budget.toLocaleString()}</span></div>
              )}
              {typeof details.revenue === 'number' && details.revenue > 0 && (
                <div className="mb-2 text-sm">Revenue: <span className="font-semibold text-blue-600">${details.revenue.toLocaleString()}</span></div>
              )}
              {Array.isArray(details.directors) && details.directors.length > 0 && (
                <div className="mb-2 text-sm">Director(s): <span className="font-semibold">{details.directors.join(', ')}</span></div>
              )}
              {Array.isArray(details.writers) && details.writers.length > 0 && (
                <div className="mb-2 text-sm">Writer(s): <span className="font-semibold">{details.writers.join(', ')}</span></div>
              )}
              {Array.isArray(details.cast) && details.cast.length > 0 && (
                <div className="mb-2 text-sm">Cast: <span className="font-semibold">{details.cast.map((c: any) => c.name || c).join(', ')}</span></div>
              )}
              {Array.isArray(details.languages) && details.languages.length > 0 && (
                <div className="mb-2 text-sm">Languages: <span className="font-semibold">{details.languages.join(', ')}</span></div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setTrailerOpen(true)}
                >
                  <Play className="w-5 h-5" /> Watch Trailer
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleWatchlistToggle}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="w-5 h-5" /> In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" /> Add to Watchlist
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating Section */}
      {user && (
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <RatingComponent 
            currentRating={details.voteAverage}
            onRate={async (rating: number) => {
              await moviesAPI.rate(contentId!, rating);
            }}
            isAuthenticated={!!user}
          />
        </div>
      )}

      {/* Cast & Crew Section */}
      <div className="container mx-auto px-4 lg:px-8">
        <CastCrewSection cast={cast} crew={crew} />
      </div>

      {/* Reviews Section */}
      {reviews && reviews.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review: any) => (
                <div key={review._id} className="bg-background p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">{review.user?.username || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold">{review.rating}/10</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.reviewText}</p>
                </div>
              ))}
            </div>
            {reviews.length > 3 && (
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => navigate('/reviews')}
              >
                View All {reviews.length} Reviews
              </Button>
            )}
          </div>
        </section>
      )}
      
      {/* Similar Content */}
      {filteredSimilarContent && filteredSimilarContent.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <ContentRow 
              title={`Similar ${contentType === 'movie' ? 'Movies' : 'TV Shows'}`} 
              items={filteredSimilarContent} 
            />
          </div>
        </section>
      )}
      
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
    </div>
  );
};

export default MovieDetailsPage;
