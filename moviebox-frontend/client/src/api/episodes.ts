import { apiClient } from '@/lib/apiClient';

export interface Episode {
  _id: string;
  id?: string; // Alternative ID field
  season: string;
  episodeNumber: number;
  title: string;
  description?: string;
  airDate?: string;
  releaseDate?: string; // Alternative date field
  runtime?: number;
  duration?: number; // Alternative duration field
  stillUrl?: string;
  thumbnailUrl?: string; // Alternative thumbnail field
  voteAverage?: number;
  averageRating?: number; // Alternative rating field
  voteCount?: number;
  ratingCount?: number; // Alternative count field
  popularity?: number;
  streamingUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const episodesAPI = {
  // Get all episodes for a season
  async getBySeason(seasonId: string) {
    return apiClient.get<Episode[]>(`/episodes/season/${seasonId}`);
  },

  // Get episode by ID
  async getById(episodeId: string) {
    return apiClient.get<Episode>(`/episodes/${episodeId}`);
  },

  // Get episode by season and episode number
  async getByNumber(seasonId: string, episodeNumber: number) {
    return apiClient.get<Episode>(`/episodes/season/${seasonId}/episode/${episodeNumber}`);
  },

  // Rate episode
  async rate(episodeId: string, rating: number) {
    return apiClient.post(`/episodes/${episodeId}/rate`, { rating });
  },

  // Get episode recommendations
  async getRecommendations(episodeId: string, limit = 5) {
    return apiClient.get<Episode[]>(`/episodes/${episodeId}/recommendations`, { limit });
  },

  // Search episodes
  async search(query: string) {
    return apiClient.get<Episode[]>('/episodes/search', { query });
  },

  // Get recently aired episodes
  async getRecentlyAired(limit = 20) {
    return apiClient.get<Episode[]>('/episodes/recently-aired', { limit });
  },
};
