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
  
  // Fetch on air today TV shows
  const { data: onAirTodayResponse } = useQuery({
    queryKey: ['tvshows', 'on-air-today'],
    queryFn: () => tvShowsAPI.getOnAirToday(10),
  });
  const onAirToday = onAirTodayResponse?.data || [];
  
  // Fetch airing this week TV shows
  const { data: airingThisWeekResponse } = useQuery({
    queryKey: ['tvshows', 'airing-this-week'],
    queryFn: () => tvShowsAPI.getAiringThisWeek(10),
  });
  const airingThisWeek = airingThisWeekResponse?.data || [];
  
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
  };
  
  // Helper function to convert TV shows to content cards
  const convertTVToCards = (tvShows: TVShow[]): ContentCardProps[] => {
    return tvShows.map((show: TVShow) => ({
      id: show._id,
      title: show.title,
      posterPath: show.posterUrl,
      backdropPath: show.backdropUrl,
      releaseYear: show.firstAirDate ? new Date(show.firstAirDate).getFullYear() : undefined,
      voteAverage: show.voteAverage ?? 0,
      mediaType: 'tvshow' as MediaType,
      description: show.description,
      genres: show.genres,
    }));
  };
  
  // If no hero content is available
  if (!heroContent) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
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
      
      {/* Content Sections */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-8 space-y-8">
          
          {/* Trending Movies */}
          {trendingMovies.length > 0 && (
            <ContentRow 
              title="Trending Movies" 
              items={convertMoviesToCards(trendingMovies)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Popular Movies */}
          {popularMovies.length > 0 && (
            <ContentRow 
              title="Popular Movies" 
              items={convertMoviesToCards(popularMovies)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Top Rated Movies */}
          {topRatedMovies.length > 0 && (
            <ContentRow 
              title="Top Rated Movies" 
              items={convertMoviesToCards(topRatedMovies)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Now Playing Movies */}
          {nowPlayingMovies.length > 0 && (
            <ContentRow 
              title="Now Playing in Theaters" 
              items={convertMoviesToCards(nowPlayingMovies)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Upcoming Movies */}
          {upcomingMovies.length > 0 && (
            <ContentRow 
              title="Upcoming Movies" 
              items={convertMoviesToCards(upcomingMovies)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Trending TV Shows */}
          {trendingTV.length > 0 && (
            <ContentRow 
              title="Trending TV Shows" 
              items={convertTVToCards(trendingTV)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Popular TV Shows */}
          {popularTV.length > 0 && (
            <ContentRow 
              title="Popular TV Shows" 
              items={convertTVToCards(popularTV)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Top Rated TV Shows */}
          {topRatedTV.length > 0 && (
            <ContentRow 
              title="Top Rated TV Shows" 
              items={convertTVToCards(topRatedTV)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* On Air Today */}
          {onAirToday.length > 0 && (
            <ContentRow 
              title="On Air Today" 
              items={convertTVToCards(onAirToday)} 
              seeAllLink="/browse"
            />
          )}
          
          {/* Airing This Week */}
          {airingThisWeek.length > 0 && (
            <ContentRow 
              title="Airing This Week" 
              items={convertTVToCards(airingThisWeek)} 
              seeAllLink="/browse"
            />
          )}
          
        </div>
      </section>
    </div>
  );
};

export default HomePage;
