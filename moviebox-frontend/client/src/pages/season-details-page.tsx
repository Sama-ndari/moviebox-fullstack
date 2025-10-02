import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Star, Play, Calendar, Clock } from 'lucide-react';
import { seasonsAPI } from '@/api/seasons';
import { episodesAPI } from '@/api/episodes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SeasonDetailsPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  const { data: seasonResponse, isLoading, error } = useQuery({
    queryKey: ['season', id],
    queryFn: () => seasonsAPI.getById(id!),
    enabled: !!id,
  });
  const data = seasonResponse?.data;

  // Fetch episodes for this season
  const { data: episodesResponse } = useQuery({
    queryKey: ['season-episodes', id],
    queryFn: () => seasonsAPI.getEpisodes(id!),
    enabled: !!id,
  });
  const episodes = Array.isArray(episodesResponse?.data) ? episodesResponse.data : [];

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (error) return <div className="text-center py-12">Error loading season.</div>;
  if (!data) return <div className="text-center py-12">Season not found.</div>;

  // Map all backend fields for details display
  const details = {
    id: data._id ?? data.id,
    seasonNumber: data.seasonNumber,
    releaseDate: data.releaseDate,
    description: data.description,
    posterUrl: data.posterUrl,
    averageRating: data.averageRating,
    ratingCount: data.ratingCount,
    popularity: data.popularity,
    episodes: Array.isArray(data.episodes) ? data.episodes : [],
    tvShow: data.tvShow,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return (
    <div className="container mx-auto pt-24 pb-12">
      {/* Season Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {details.posterUrl && (
          <div className="w-full md:w-64 flex-shrink-0">
            <img 
              src={details.posterUrl} 
              alt={`Season ${details.seasonNumber}`} 
              className="w-full rounded-lg shadow-lg" 
            />
          </div>
        )}
        
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Season {details.seasonNumber}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {details.releaseDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(details.releaseDate).getFullYear()}</span>
              </div>
            )}
            
            {details.averageRating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{details.averageRating}</span>
                <span className="text-muted-foreground">({details.ratingCount} ratings)</span>
              </div>
            )}
            
            {episodes.length > 0 && (
              <div className="text-muted-foreground">
                {episodes.length} Episodes
              </div>
            )}
          </div>
          
          {details.description && (
            <p className="text-muted-foreground mb-6">{details.description}</p>
          )}
        </div>
      </div>

      {/* Episodes Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Episodes</h2>
        
        {episodes.length > 0 ? (
          <div className="space-y-4">
            {episodes.map((episode: any, index: number) => (
              <Card 
                key={episode._id || index}
                className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/episode/${episode._id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Episode Thumbnail */}
                    <div className="relative w-full md:w-64 aspect-video bg-muted flex-shrink-0">
                      {episode.stillUrl || episode.thumbnailUrl ? (
                        <img 
                          src={episode.stillUrl || episode.thumbnailUrl} 
                          alt={`Episode ${episode.episodeNumber}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded text-xs font-semibold">
                        E{episode.episodeNumber}
                      </div>
                    </div>
                    
                    {/* Episode Info */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          {episode.episodeNumber}. {episode.title}
                        </h3>
                        {(episode.runtime || episode.duration) && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{episode.runtime || episode.duration}m</span>
                          </div>
                        )}
                      </div>
                      
                      {episode.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {episode.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4">
                        {episode.airDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(episode.airDate).toLocaleDateString()}
                          </span>
                        )}
                        
                        {(episode.voteAverage || episode.averageRating) && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-semibold">
                              {episode.voteAverage || episode.averageRating}
                            </span>
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/episode/${episode._id}`);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No episodes available for this season.
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonDetailsPage;
