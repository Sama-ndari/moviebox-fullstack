import React from "react";
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { moviesAPI } from '@/api/movies';
import { tvShowsAPI } from '@/api/tvshows';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaType, ContentCardProps } from '@/types';

const GenreResultsPage = () => {
  const params = useParams();
  const genre = params.genre ? String(params.genre) : '';
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = React.useState<'all' | 'movie' | 'tvshow'>('all');

  React.useEffect(() => {
    setActiveTab('all');
  }, [genre]);

  // Fetch movies for this genre
  const moviesQuery = useQuery({
    queryKey: ['movies', 'genre', genre],
    queryFn: () => moviesAPI.getAll(1, 100, genre),
    enabled: !!genre,
  });
  const movies: any[] = moviesQuery.data?.data?.items || [];
  const isLoadingMovies = moviesQuery.isLoading;

  // Fetch tv shows for this genre
  const tvshowsQuery = useQuery({
    queryKey: ['tvshows', 'genre', genre],
    queryFn: () => tvShowsAPI.getAll(1, 100),
    enabled: !!genre,
  });
  const tvshows: any[] = tvshowsQuery.data?.data?.items || [];
  const isLoadingTvShows = tvshowsQuery.isLoading;

  const isLoading = isLoadingMovies || isLoadingTvShows;
  const isError = !isLoading && (!moviesQuery.data && !tvshowsQuery.data);

  // Combine and deduplicate by id for 'all'
  const all = [...movies, ...tvshows];
  const seen = new Set();
  const allContent: ContentCardProps[] = all.filter(item => {
    const id = item._id ?? item.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map((item: any) => ({
    id: item._id ?? item.id,
    title: item.title,
    posterPath: item.posterUrl ?? item.posterPath,
    backdropPath: item.backdropUrl,
    releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : (item.firstAirDate ? new Date(item.firstAirDate).getFullYear() : undefined),
    voteAverage: item.averageRating ?? item.voteAverage ?? '',
    mediaType: item.mediaType ?? (item.releaseDate ? 'movie' : 'tvshow') as MediaType,
    description: item.description,
    genres: item.genres,
    status: item.status,
    trailerUrl: item.trailerUrl,
    contentRating: item.contentRating,
    ratingCount: item.ratingCount,
    seasons: item.seasons,
    totalEpisodes: item.totalEpisodes,
    cast: item.cast,
    crew: item.crew,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    popularity: item.popularity,
    // ...add more as needed
  }));

  let filteredContent: ContentCardProps[] = allContent;
  if (activeTab === 'movie') {
    filteredContent = allContent.filter(item => item.mediaType === 'movie');
  } else if (activeTab === 'tvshow') {
    filteredContent = allContent.filter(item => item.mediaType === 'tvshow');
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-bold mb-2">Error loading genre results</h2>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
  if (!filteredContent || !filteredContent.length) return (
    <div className="text-center py-12">
      <p className="text-xl mb-2">No results found for genre "{genre}"</p>
      <p className="text-muted-foreground">Try another genre.</p>
    </div>
  );

  return (
    <div className="container mx-auto pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-4">{genre} Results</h1>
      <Tabs
        key={genre}
        value={activeTab}
        onValueChange={val => setActiveTab(val as 'all' | 'movie' | 'tvshow')}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="movie">Movies</TabsTrigger>
          <TabsTrigger value="tvshow">TV Shows</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredContent.map((item: ContentCardProps) => (
          <div
            key={item.id}
            className="movie-card transition-transform duration-300 ease-out cursor-pointer"
            onClick={() => navigate(`/${item.mediaType}/${item.id}`)}
          >
            <div className="relative rounded-lg overflow-hidden">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreResultsPage;
