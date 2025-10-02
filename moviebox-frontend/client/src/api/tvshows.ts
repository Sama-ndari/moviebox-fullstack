import { apiClient } from '@/lib/apiClient';

export interface TVShow {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  firstAirDate: string;
  lastAirDate?: string;
  genres: string[];
  status: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  contentRating: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRuntime?: number;
  cast?: any[];
  crew?: any[];
  isFeatured: boolean;
  isActive: boolean;
  isAdult: boolean;
  languages?: string[];
  country?: string;
  productionCompany?: string;
  creators: string[];
  networks?: string[];
  voteAverage?: number;
  voteCount?: number;
  popularity?: number;
  createdAt: string;
  updatedAt: string;
  seasons?: any[];
}

export interface PaginatedTVShows {
  items: TVShow[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const tvShowsAPI = {
  // Get all TV shows with pagination
  async getAll(page = 1, limit = 20) {
    return apiClient.get<PaginatedTVShows>('/tv-shows', { page, limit });
  },

  // Get trending TV shows
  async getTrending(limit = 10) {
    return apiClient.get<TVShow[]>('/tv-shows/trending', { limit });
  },

  // Get popular TV shows
  async getPopular(limit = 10) {
    return apiClient.get<TVShow[]>('/tv-shows/popular', { limit });
  },

  // Get top rated TV shows
  async getTopRated(limit = 10) {
    return apiClient.get<TVShow[]>('/tv-shows/top-rated', { limit });
  },

  // Get on air today
  async getOnAirToday(limit = 10) {
    return apiClient.get<TVShow[]>('/tv-shows/on-air-today', { limit });
  },

  // Get airing this week
  async getAiringThisWeek(limit = 10) {
    return apiClient.get<TVShow[]>('/tv-shows/airing-this-week', { limit });
  },

  // Get TV show by ID
  async getById(id: string) {
    return apiClient.get<TVShow>(`/tv-shows/${id}`);
  },

  // Search TV shows
  async search(query: string) {
    return apiClient.get<TVShow[]>('/tv-shows/search', { query });
  },

  // Filter TV shows
  async filter(filters: Record<string, any>) {
    return apiClient.get<TVShow[]>('/tv-shows/filter', filters);
  },

  // Rate TV show
  async rate(id: string, rating: number) {
    return apiClient.post(`/tv-shows/${id}/rate`, { rating });
  },

  // Get TV show recommendations
  async getRecommendations(id: string, limit = 5) {
    return apiClient.get<TVShow[]>(`/tv-shows/${id}/recommendations`, { limit });
  },

  // Get TV show cast
  async getCast(id: string) {
    return apiClient.get(`/tv-shows/${id}/cast`);
  },

  // Get TV show crew
  async getCrew(id: string) {
    return apiClient.get(`/tv-shows/${id}/crew`);
  },

  // Get TV show seasons
  async getSeasons(id: string) {
    return apiClient.get(`/tv-shows/${id}/seasons`);
  },
};
