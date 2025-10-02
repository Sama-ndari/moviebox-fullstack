import { apiClient } from '@/lib/apiClient';

export interface Movie {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  releaseDate: string;
  genres: string[];
  status: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  contentRating: string;
  duration: number;
  budget?: number;
  revenue?: number;
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  cast?: any[];
  crew?: any[];
  isFeatured: boolean;
  isActive: boolean;
  streamingUrl: string;
  isAdult: boolean;
  languages?: string[];
  country?: string;
  productionCompany?: string;
  directors: string[];
  writers: string[];
  createdAt: string;
  updatedAt: string;
  ratingCount?: number;
  reviews?: any[];
}

export interface PaginatedMovies {
  items: Movie[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const moviesAPI = {
  // Get all movies with pagination
  async getAll(page = 1, limit = 20, genre?: string) {
    return apiClient.get<PaginatedMovies>('/movies/all', { page, limit, genre });
  },

  // Get trending movies
  async getTrending(limit = 10) {
    return apiClient.get<Movie[]>('/movies/trending', { limit });
  },

  // Get popular movies
  async getPopular(limit = 10) {
    return apiClient.get<Movie[]>('/movies/popular', { limit });
  },

  // Get top rated movies
  async getTopRated(limit = 10) {
    return apiClient.get<Movie[]>('/movies/top-rated', { limit });
  },

  // Get now playing movies
  async getNowPlaying(limit = 10) {
    return apiClient.get<Movie[]>('/movies/now-playing', { limit });
  },

  // Get upcoming movies
  async getUpcoming(limit = 10) {
    return apiClient.get<Movie[]>('/movies/upcoming', { limit });
  },

  // Get movie by ID
  async getById(id: string) {
    return apiClient.get<Movie>(`/movies/${id}`);
  },

  // Search movies
  async search(query: string) {
    return apiClient.get<Movie[]>('/movies/search', { query });
  },

  // Filter movies
  async filter(filters: Record<string, any>) {
    return apiClient.get<Movie[]>('/movies/filter', filters);
  },

  // Rate movie
  async rate(id: string, rating: number) {
    return apiClient.post(`/movies/${id}/rate`, { rating });
  },

  // Get movie recommendations
  async getRecommendations(id: string, limit = 5) {
    return apiClient.get<Movie[]>(`/movies/${id}/recommendations`, { limit });
  },

  // Get movie cast
  async getCast(id: string) {
    return apiClient.get(`/movies/${id}/cast`);
  },

  // Get movie crew
  async getCrew(id: string) {
    return apiClient.get(`/movies/${id}/crew`);
  },
};
