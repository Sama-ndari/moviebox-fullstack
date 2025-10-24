import { apiClient } from '@/lib/apiClient';

export interface Review {
  _id: string;
  user: string;
  targetId: string;
  targetType: 'movie' | 'tvshow' | 'season' | 'episode';
  rating: number;
  title?: string;
  content: string;
  likes: number;
  dislikes: number;
  isVerified: boolean;
  isSpoiler: boolean;
  createdAt: string;
  updatedAt: string;
}

export const reviewsAPI = {
  // Create review
  async create(data: {
    targetId: string;
    targetType: string;
    rating: number;
    title?: string;
    content: string;
    isSpoiler?: boolean;
  }) {
    return apiClient.post<Review>('/reviews', data);
  },

  // Get all reviews
  async getAll(page = 1, limit = 20) {
    return apiClient.get<{ items: Review[]; meta: any }>('/reviews', { page, limit });
  },

  // Get reviews by target (movie/show)
  async getByTarget(targetId: string, targetType: string) {
    return apiClient.get<Review[]>('/reviews/by-target', { targetId, targetType });
  },

  // Get reviews by user
  async getByUser(userId: string) {
    return apiClient.get<Review[]>('/reviews/by-user', { userId });
  },

  // Get reviews filtered by rating
  async getByRating(rating: number, targetId?: string) {
    return apiClient.get<Review[]>('/reviews/by-rating', { rating, targetId });
  },

  // Get review by ID
  async getById(id: string) {
    return apiClient.get<Review>(`/reviews/${id}`);
  },

  // Update review
  async update(id: string, data: Partial<Review>) {
    return apiClient.patch<Review>(`/reviews/${id}`, data);
  },

  // Delete review
  async delete(id: string) {
    return apiClient.delete(`/reviews/${id}`);
  },
};
