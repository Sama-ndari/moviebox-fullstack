import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Star } from 'lucide-react';
import { tvShowsAPI, TVShow } from '@/api/tvshows';
import { reviewsAPI } from '@/api/reviews';
import { ContentCardProps, MediaType } from '@/types';
import { Button } from '@/components/ui/button';
import { CastCrewSection } from '@/components/ui/cast-crew-section';
import { RatingComponent } from '@/components/ui/rating-component';
import { useAuth } from '@/hooks/use-auth';

const TVShowDetailsPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showAllSeasons, setShowAllSeasons] = useState(false);
  const { user } = useAuth();
  
  const { data: tvShowResponse, isLoading, error } = useQuery({
    queryKey: ['tvshow', id],
    queryFn: () => tvShowsAPI.getById(id!),
    enabled: !!id,
  });
  const data = tvShowResponse?.data;

  // Fetch cast & crew
  const { data: castResponse } = useQuery({
    queryKey: ['tvshow-cast', id],
    queryFn: () => tvShowsAPI.getCast(id!),
    enabled: !!id,
  });
  const cast = Array.isArray(castResponse?.data) ? castResponse.data : [];
  
  const { data: crewResponse } = useQuery({
    queryKey: ['tvshow-crew', id],
    queryFn: () => tvShowsAPI.getCrew(id!),
    enabled: !!id,
  });
  const crew = Array.isArray(crewResponse?.data) ? crewResponse.data : [];

  // Fetch reviews
  const { data: reviewsResponse } = useQuery({
    queryKey: ['reviews', 'tvshow', id],
    queryFn: () => reviewsAPI.getByTarget(id!, 'tvshow'),
    enabled: !!id,
  });
  const reviews = reviewsResponse?.data || [];

  // Fetch recommended content using backend recommendations endpoint
  const {
    data: similarResponse,
    isLoading: isLoadingSimilar
  } = useQuery({
    queryKey: ['tvshow-recommendations', id],
    queryFn: () => tvShowsAPI.getRecommendations(id!, 6),
    enabled: !!id,
  });
  const similarContent = similarResponse?.data || [];

  const filteredSimilarContent = Array.isArray(similarContent)
    ? similarContent
        .filter((item: any) => String(item._id || item.id) !== String(id))
        .slice(0, 6)
        .map((item: any) => ({
          id: String(item._id || item.id),
          title: item.title,
          posterPath: item.posterUrl,
          releaseYear: item.firstAirDate ? new Date(item.firstAirDate).getFullYear() : undefined,
          voteAverage: item.voteAverage,
          mediaType: 'tvshow' as MediaType,
        })) as ContentCardProps[]
    : [];

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-12">Error loading TV show.</div>;
  if (!data) return <div className="text-center py-12">TV show not found.</div>;

  // Map all backend fields for details display
  const details = {
    id: data._id,
    title: data.title,
    posterUrl: data.posterUrl,
    backdropUrl: data.backdropUrl,
    releaseDate: data.firstAirDate,
    endDate: data.lastAirDate,
    description: data.description,
    genres: data.genres,
    trailerUrl: data.trailerUrl,
    contentRating: data.contentRating,
    averageRating: data.voteAverage,
    ratingCount: data.voteCount,
    popularity: data.popularity,
    seasons: data.seasons,
    totalEpisodes: data.numberOfEpisodes,
    cast: data.cast,
    crew: data.crew,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return (
    <div className="container mx-auto pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-4">{details.title}</h1>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
        {details.contentRating && (
          <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">{details.contentRating}</span>
        )}
        {details.releaseDate && <span>{new Date(details.releaseDate).getFullYear()}</span>}
        {details.endDate && <span>Ended: {new Date(details.endDate).getFullYear()}</span>}
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
          <span>{details.averageRating}</span>
        </div>
      </div>
      {details.genres && details.genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {details.genres.map((genre: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-muted rounded-full text-xs">{genre}</span>
          ))}
        </div>
      )}
      <p className="text-base text-muted-foreground mb-8">{details.description}</p>
      {details.seasons && details.seasons.length > 0 && (
        <div className="mb-4">
          <strong>Seasons:</strong> {details.seasons.length}
          <Button size="sm" variant="link" onClick={() => setShowAllSeasons(v => !v)}>
            {showAllSeasons ? 'Hide' : 'Show'} All Seasons
          </Button>
          {showAllSeasons && (
            <ul className="list-disc ml-6 mt-2">
              {details.seasons.map((season: any, idx: number) => (
                <li key={season._id || idx}>{season.name || `Season ${idx + 1}`}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {/* Rating Section */}
      {user && (
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <RatingComponent 
            currentRating={details.averageRating}
            onRate={async (rating: number) => {
              await tvShowsAPI.rate(id!, rating);
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
    </div>
  );
};

export default TVShowDetailsPage;
