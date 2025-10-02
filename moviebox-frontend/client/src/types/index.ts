import { Movie, TvShow, User, Watchlist, WatchHistory, Genre } from "@shared/schema";

export type MediaType = "movie" | "tvshow" | "person";

export interface ContentCardProps {
  id: string; // _id from backend
  title: string;
  posterPath: string;
  backdropPath?: string;
  releaseYear?: number;
  voteAverage?: number | string;
  mediaType: MediaType;
  // Extended fields for Movie/TVShow
  description?: string;
  fullDescription?: string;
  genres?: string[];
  status?: string;
  trailerUrl?: string;
  contentRating?: string;
  reviews?: any[];
  ratingCount?: number;
  duration?: number;
  budget?: number;
  revenue?: number | null;
  voteCount?: number | null;
  popularity?: number;
  cast?: any[];
  crew?: any[];
  isFeatured?: boolean;
  isActive?: boolean;
  streamingUrl?: string;
  isAdult?: boolean;
  languages?: string[];
  country?: string;
  productionCompany?: string;
  directors?: string[];
  writers?: string[];
  createdAt?: string;
  updatedAt?: string;
  averageRating?: number;
  // TV show specific
  firstAirDate?: string;
  lastAirDate?: string;
  seasons?: any[];
  episodes?: any[];
  totalEpisodes?: number;
}

export interface ContinueWatchingItem extends WatchHistory {
  title: string;
  posterPath: string;
  totalDuration: number; // in seconds
  episodeInfo?: string; // for TV shows
}

export interface HeaderProps {
  transparent?: boolean;
}

export interface HeroSectionProps {
  title: string;
  overview: string;
  backdropPath: string;
  releaseYear: number;
  duration?: number; // in minutes, for movies
  rating: string;
  voteAverage: string;
  id: string | number; // Accept both MongoDB _id (string) and numeric IDs
  mediaType: MediaType;
}

export interface GenreCardProps {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ContentRowProps {
  title: string;
  items: ContentCardProps[];
  seeAllLink?: string;
}

export interface ContinueWatchingRowProps {
  items: ContinueWatchingItem[];
}

export interface SearchFormProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export interface ContentDetails extends Partial<Movie>, Partial<TvShow> {
  id: number;
  title: string;
  overview: string;
  mediaType: MediaType;
  inWatchlist?: boolean;
}
