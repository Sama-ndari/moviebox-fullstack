import { apiClient } from '@/lib/apiClient';

export interface WatchHistoryItem {
  _id: string;
  user: string;
  contentId: string;
  contentType: 'movie' | 'tvshow' | 'episode';
  watchedAt: string;
  watchedDuration: number;
  totalDuration: number;
  completed: boolean;
  lastPosition?: number;
  deviceType?: string;
  quality?: string;
}

export interface WatchHistoryAnalytics {
  totalWatchTime: number;
  totalWatched?: number; // Total items watched
  totalMovies: number;
  totalTVShows: number;
  totalEpisodes: number;
  favoriteGenres: string[];
  watchingTrends: any[];
  thisMonth?: number; // Items watched this month
}

export const watchHistoryAPI = {
  // Add to watch history
  async add(userId: string, data: {
    contentId: string;
    contentType: 'movie' | 'tvshow' | 'episode';
    watchedDuration: number;
    totalDuration: number;
    completed: boolean;
    lastPosition?: number;
  }) {
    return apiClient.post(`/watchhistory/${userId}`, data);
  },

  // Get user watch history
  async getHistory(userId: string, page = 1, limit = 20) {
    return apiClient.get<{ items: WatchHistoryItem[]; meta: any }>(`/watchhistory/${userId}`, { page, limit });
  },

  // Get watch analytics
  async getAnalytics(userId: string) {
    return apiClient.get<WatchHistoryAnalytics>(`/watchhistory/analytics/${userId}`);
  },

  // Update watch history item
  async update(userId: string, historyId: string, data: Partial<WatchHistoryItem>) {
    return apiClient.patch(`/watchhistory/${userId}/${historyId}`, data);
  },

  // Delete watch history item
  async delete(userId: string, historyId: string) {
    return apiClient.delete(`/watchhistory/${userId}/${historyId}`);
  },

  // Clear all watch history
  async clearAll(userId: string) {
    return apiClient.delete(`/watchhistory/${userId}/clear-all`);
  },
};
