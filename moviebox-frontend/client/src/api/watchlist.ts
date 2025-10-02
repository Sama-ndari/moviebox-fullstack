import { apiClient } from '@/lib/apiClient';

export interface WatchlistItem {
  _id: string;
  user: string;
  contentId: string;
  contentType: 'movie' | 'tvshow';
  addedAt: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export const watchlistAPI = {
  // Get user's watchlist
  async getWatchlist(userId: string) {
    return apiClient.get<WatchlistItem[]>(`/watchlist/${userId}`);
  },

  // Add item to watchlist
  async addToWatchlist(userId: string, contentId: string, contentType: 'movie' | 'tvshow', priority?: string, notes?: string) {
    return apiClient.post(`/watchlist/${userId}`, {
      contentId,
      contentType,
      priority,
      notes,
    });
  },

  // Remove from watchlist
  async removeFromWatchlist(contentId: string, contentType: string, userId: string) {
    return apiClient.delete(`/watchlist/${contentId}/${contentType}/${userId}`);
  },

  // Update watchlist item
  async updateWatchlistItem(watchlistItemId: string, userId: string, data: { priority?: string; notes?: string }) {
    return apiClient.put(`/watchlist/${watchlistItemId}/${userId}`, data);
  },

  // Share watchlist
  async shareWatchlist(userId: string) {
    return apiClient.post(`/watchlist/share/${userId}`);
  },

  // Get shared watchlist
  async getSharedWatchlist(ownerId: string) {
    return apiClient.get(`/watchlist/shared/${ownerId}`);
  },

  // Check if item is in watchlist
  async isInWatchlist(userId: string, contentId: string, contentType: string) {
    return apiClient.get(`/watchlist/${userId}/check/${contentId}/${contentType}`);
  },
};
