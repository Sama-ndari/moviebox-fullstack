import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import HeroSection from '@/components/ui/hero-section';
import ContentRow from '@/components/ui/content-row';
import { ContentCardProps, MediaType } from '@/types';
import { moviesAPI, Movie } from '@/api/movies';
import { tvShowsAPI, TVShow } from '@/api/tvshows';

const HomePage = () => {
  const [, navigate] = useLocation();
  
  // Fetch trending movies
  const { data: trendingMoviesResponse } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: () => moviesAPI.getTrending(10),
  });
  const trendingMovies = trendingMoviesResponse?.data || [];
  
  // Fetch popular movies
  const { data: popularMoviesResponse } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => moviesAPI.getPopular(10),
  });
  const popularMovies = popularMoviesResponse?.data || [];
  
  // Fetch top rated movies
  const { data: topRatedMoviesResponse } = useQuery({
    queryKey: ['movies', 'top-rated'],
    queryFn: () => moviesAPI.getTopRated(10),
  });
  const topRatedMovies = topRatedMoviesResponse?.data || [];
  
  // Fetch now playing movies
  const { data: nowPlayingMoviesResponse } = useQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn: () => moviesAPI.getNowPlaying(10),
  });
  const nowPlayingMovies = nowPlayingMoviesResponse?.data || [];
  
  // Fetch upcoming movies
  const { data: upcomingMoviesResponse } = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => moviesAPI.getUpcoming(10),
  });
  const upcomingMovies = upcomingMoviesResponse?.data || [];
  
  // Fetch trending TV shows
  const { data: trendingTVResponse } = useQuery({
    queryKey: ['tvshows', 'trending'],
    queryFn: () => tvShowsAPI.getTrending(10),
  });
  const trendingTV = trendingTVResponse?.data || [];
  
  // Fetch popular TV shows
  const { data: popularTVResponse } = useQuery({
    queryKey: ['tvshows', 'popular'],
    queryFn: () => tvShowsAPI.getPopular(10),
  });
  const popularTV = popularTVResponse?.data || [];
  
  // Fetch top rated TV shows
  const { data: topRatedTVResponse } = useQuery({
    queryKey: ['tvshows', 'top-rated'],
    queryFn: () => tvShowsAPI.getTopRated(10),
  });
  const topRatedTV = topRatedTVResponse?.data || [];
  
  const [heroContent, setHeroContent] = useState<Movie | null>(null);
  const [heroType, setHeroType] = useState<MediaType>('movie');
  
  // Set hero content from trending movies
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      setHeroContent(trendingMovies[0]);
      setHeroType('movie');
    }
  }, [trendingMovies]);
  
  // Helper function to convert movies to content cards
  const convertMoviesToCards = (movies: Movie[]): ContentCardProps[] => {
    return movies.map((movie: Movie) => ({
    id: movie._id,
    title: movie.title,
    posterPath: movie.posterUrl,
    backdropPath: movie.backdropUrl,
    releaseYear: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined,
    voteAverage: movie.voteAverage ?? 0,
    mediaType: 'movie' as MediaType,
    description: movie.description,
    genres: movie.genres,
    duration: movie.duration,
  }));

  // TV shows - Coming soon
  const tvShowCards: ContentCardProps[] = [];
  
  // Loading state
  if (isLoadingFeaturedMovies || isLoadingMovies || isLoadingFeaturedTvShows || isLoadingTvShows) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If no hero content is available
  if (!heroContent) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p className="text-xl">No featured content available</p>
        <button 
          onClick={() => navigate('/browse')} 
          className="px-6 py-2 bg-primary rounded-md text-white font-medium"
        >
          Browse Content
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
      {heroContent && (
        <HeroSection
          id={heroContent._id}
          title={heroContent.title}
          overview={heroContent.description}
          backdropPath={heroContent.backdropUrl || heroContent.posterUrl}
          releaseYear={heroContent.releaseDate ? new Date(heroContent.releaseDate).getFullYear() : new Date().getFullYear()}
          duration={heroContent.duration}
          rating={heroContent.contentRating || 'PG-13'}
          voteAverage={String(heroContent.voteAverage ?? 0)}
          mediaType={heroType}
        />
      )}
      
      {/* Content Sections */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Trending Movies */}
          {movieCards.length > 0 && (
            <ContentRow 
              title="Trending Now" 
              items={movieCards.slice(0, 6)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Popular TV Shows */}
          {tvShowCards.length > 0 && (
            <ContentRow 
              title="Popular TV Shows" 
              items={tvShowCards.slice(0, 6)} 
              seeAllLink="/browse"
            />
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Ready to watch?</h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Join MovieBox today. Discover thousands of movies and shows.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
            />
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              Try it free
            </button>
          </div>
          
          <p className="text-muted-foreground text-xs mt-4">
            Only new members are eligible for this offer.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
