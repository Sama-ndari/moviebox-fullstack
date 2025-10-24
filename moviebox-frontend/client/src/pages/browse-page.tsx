import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import ContentRow from '@/components/ui/content-row';
import GenreCard from '@/components/ui/genre-card';
import { ContentCardProps, MediaType } from '@/types';
import AuthGuard from '@/components/auth/auth-guard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { moviesAPI, Movie } from '@/api/movies';
import { tvShowsAPI, TVShow } from '@/api/tvshows';
import { useLocation } from 'wouter';

const BrowsePageContent = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
  const [minRating, setMinRating] = useState<number>(0);
  const [, navigate] = useLocation();
  
  // Fetch movies
  const { data: moviesResponse, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['movies', 'all'],
    queryFn: () => moviesAPI.getAll(1, 100),
  });
  const moviesData = moviesResponse?.data?.items || [];

  // Fetch TV shows
  const { data: tvShowsResponse, isLoading: isLoadingTvShows } = useQuery({
    queryKey: ['tvshows', 'all'],
    queryFn: () => tvShowsAPI.getAll(1, 100),
  });
  const tvShowsData = tvShowsResponse?.data?.items || [];

  // Convert movies to content card props
  const movieCards: ContentCardProps[] = Array.isArray(moviesData) ? moviesData.map((movie: Movie) => ({
    id: movie._id,
    title: movie.title,
    posterPath: movie.posterUrl,
    backdropPath: movie.backdropUrl,
    releaseYear: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined,
    voteAverage: movie.voteAverage ?? 0,
    mediaType: 'movie' as MediaType,
    description: movie.description,
    genres: movie.genres,
    status: movie.status,
    trailerUrl: movie.trailerUrl,
    contentRating: movie.contentRating,
    ratingCount: movie.ratingCount,
    cast: movie.cast,
    crew: movie.crew,
    isFeatured: movie.isFeatured,
    isActive: movie.isActive,
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt,
    popularity: movie.popularity,
    // ...add more as needed
  })) : [];

  // Convert TV shows to content card props
  const tvShowCards: ContentCardProps[] = Array.isArray(tvShowsData) ? tvShowsData.map((tvShow: TVShow) => ({
    id: tvShow._id,
    title: tvShow.title,
    posterPath: tvShow.posterUrl,
    backdropPath: tvShow.backdropUrl,
    releaseYear: tvShow.firstAirDate ? new Date(tvShow.firstAirDate).getFullYear() : undefined,
    voteAverage: tvShow.voteAverage ?? 0,
    mediaType: 'tvshow' as MediaType,
    description: tvShow.description,
    genres: tvShow.genres,
    status: tvShow.status,
    trailerUrl: tvShow.trailerUrl,
    contentRating: tvShow.contentRating,
    seasons: tvShow.seasons,
    totalEpisodes: tvShow.numberOfEpisodes,
    cast: tvShow.cast,
    crew: tvShow.crew,
    isFeatured: tvShow.isFeatured,
    isActive: tvShow.isActive,
    createdAt: tvShow.createdAt,
    updatedAt: tvShow.updatedAt,
    popularity: tvShow.popularity,
    // ...add more as needed
  })) : [];
  
  // Extract genres from movies and TV shows
  const genreSet = new Set<string>();
  moviesData.forEach((movie: Movie) => {
    if (Array.isArray(movie.genres)) {
      movie.genres.forEach((g: string) => genreSet.add(g));
    }
  });
  tvShowsData.forEach((show: TVShow) => {
    if (Array.isArray(show.genres)) {
      show.genres.forEach((g: string) => genreSet.add(g));
    }
  });
  const genres = Array.from(genreSet).map((name, i) => ({
    id: i,
    name,
    imageUrl: undefined,
    // `https://via.placeholder.com/150?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
  }));

  // Filter and sort content
  const filterAndSortContent = (items: ContentCardProps[], contentType: 'movie' | 'tvshow' | 'all') => {
    let filteredItems = items;
    if (contentType === 'movie') {
      filteredItems = items.filter((item: ContentCardProps) => item.mediaType === 'movie');
    } else if (contentType === 'tvshow') {
      filteredItems = items.filter((item: ContentCardProps) => item.mediaType === 'tvshow');
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filteredItems = filteredItems.filter((item: ContentCardProps) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre !== 'all') {
      filteredItems = filteredItems.filter((item: ContentCardProps) => 
        item.genres?.includes(selectedGenre)
      );
    }
    
    // Filter by year range
    filteredItems = filteredItems.filter((item: ContentCardProps) => {
      const year = item.releaseYear ?? 0;
      return year >= yearRange[0] && year <= yearRange[1];
    });
    
    // Filter by rating
    filteredItems = filteredItems.filter((item: ContentCardProps) => {
      const rating = typeof item.voteAverage === 'number' ? item.voteAverage : parseFloat(item.voteAverage ?? '0');
      return rating >= minRating;
    });
    
    // Sort
    let sorted = [...filteredItems];
    
    if (sortBy === 'recent') {
      sorted.sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => {
        const aRating = typeof a.voteAverage === 'number' ? a.voteAverage : parseFloat(a.voteAverage ?? '0');
        const bRating = typeof b.voteAverage === 'number' ? b.voteAverage : parseFloat(b.voteAverage ?? '0');
        return bRating - aRating;
      });
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return sorted;
  };
  
  // Get all content
  const allContent = [...movieCards, ...tvShowCards];
  const filteredContent = filterAndSortContent(allContent, filter as any);
  
  // Group content by genres
  const contentByGenre: Record<string, ContentCardProps[]> = {};
  
  if (allContent && genres) {
    (genres as any[]).forEach((genre: any) => {
      const genreContent = allContent.filter((item: ContentCardProps) => 
        Array.isArray(item.genres) && item.genres.includes(genre.name)
      );
      if (genreContent.length > 0) {
        contentByGenre[genre.name] = genreContent;
      }
    });
  }
  
  // Loading state
  if (isLoadingMovies || isLoadingTvShows) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Browse</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-60"
            />
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={minRating.toString()} onValueChange={(val) => setMinRating(Number(val))}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Ratings</SelectItem>
                <SelectItem value="5">5+ ⭐</SelectItem>
                <SelectItem value="6">6+ ⭐</SelectItem>
                <SelectItem value="7">7+ ⭐</SelectItem>
                <SelectItem value="8">8+ ⭐</SelectItem>
                <SelectItem value="9">9+ ⭐</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue={filter} value={filter} onValueChange={(val) => { setFilter(val); console.debug('FILTER CHANGED:', val); }} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="movie">Movies</TabsTrigger>
            <TabsTrigger value="tvshow">TV Shows</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Content listing */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredContent.map((item) => (
              <div
                key={`${item.mediaType}-${item.id}`}
                className="movie-card transition-transform duration-300 ease-out cursor-pointer"
                onClick={() => {
                  if (!item.id || !item.mediaType) {
                    console.error('NAVIGATION ERROR: Invalid id or mediaType', item);
                    return;
                  }
                  console.debug('NAVIGATE TO:', `/${item.mediaType}/${item.id}`);
                  navigate(`/${item.mediaType}/${item.id}`);
                }}
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
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No results found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}
        
        {/* Browse by Genre */}
        {genres && genres.length > 0 && (
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(genres as any[]).map((genre: any) => (
                <GenreCard
                  key={genre.id}
                  id={genre.id}
                  name={genre.name}
                  imageUrl={genre.imageUrl}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Content by genre */}
        {Object.entries(contentByGenre).map(([genreName, items]) => (
          <section key={genreName} className="my-12">
            <ContentRow 
              title={genreName} 
              items={items}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

// Main export component wrapping the content in auth guard
export default function BrowsePage() {
  return <BrowsePageContent />;
}
