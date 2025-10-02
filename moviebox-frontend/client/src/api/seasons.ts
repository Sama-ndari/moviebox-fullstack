import { apiClient } from '@/lib/apiClient';

export interface Season {
  id: string;
  releaseDate: any;
  averageRating: any;
  ratingCount: any;
  popularity: any;
  _id: string;
  tvShow: string;
  seasonNumber: number;
  title: string;
  description?: string;
  posterUrl?: string;
  airDate?: string;
  episodeCount: number;
  episodes?: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const seasonsAPI = {
  // Get all seasons for a TV show
  async getByTVShow(tvShowId: string) {
    return apiClient.get<Season[]>(`/seasons/tvshow/${tvShowId}`);
  },

  // Get season by ID
  async getById(seasonId: string) {
    return apiClient.get<Season>(`/seasons/${seasonId}`);
  },

  // Get season by TV show and season number
  async getByNumber(tvShowId: string, seasonNumber: number) {
    return apiClient.get<Season>(`/seasons/tvshow/${tvShowId}/season/${seasonNumber}`);
  },

  // Get season episodes
  async getEpisodes(seasonId: string) {
    return apiClient.get(`/seasons/${seasonId}/episodes`);
  },

  // Search seasons
  async search(query: string) {
    return apiClient.get<Season[]>('/seasons/search', { query });
  },
};
