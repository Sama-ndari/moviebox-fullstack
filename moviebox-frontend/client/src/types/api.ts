// Comprehensive TypeScript interfaces for all API responses

export interface Person {
  _id: string;
  name: string;
  profileUrl?: string;
  profilePath?: string;
  biography?: string;
  birthday?: string;
  deathday?: string;
  placeOfBirth?: string;
  knownFor?: string;
  gender?: number;
  popularity?: number;
}

export interface CastMember extends Person {
  character: string;
  order?: number;
}

export interface CrewMember extends Person {
  job: string;
  department?: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  targetId: string;
  targetType: 'movie' | 'tvshow' | 'episode';
  rating: number;
  reviewText: string;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItem {
  _id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'tvshow';
  title: string;
  posterPath: string;
  releaseYear?: number;
  averageRating?: number;
  mediaType: 'movie' | 'tvshow';
  notes?: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchHistoryItem {
  _id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'tvshow' | 'episode';
  watchedAt: string;
  progress?: number;
  completed: boolean;
  title?: string;
  posterUrl?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'new_content' | 'recommendation' | 'review' | 'follow' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface Season {
  _id: string;
  tvShow: string;
  seasonNumber: number;
  name?: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  episodes: string[];
  averageRating?: number;
  ratingCount?: number;
  popularity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  _id: string;
  season: string;
  episodeNumber: number;
  title: string;
  description?: string;
  duration?: number;
  runtime?: number;
  releaseDate?: string;
  airDate?: string;
  thumbnailUrl?: string;
  stillUrl?: string;
  averageRating?: number;
  voteAverage?: number;
  ratingCount?: number;
  popularity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
