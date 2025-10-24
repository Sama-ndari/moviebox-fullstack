import { apiClient } from '@/lib/apiClient';

export interface User {
  watchlistCount: number;
  reviewsCount: number;
  ratingsCount: number;
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  followers?: string[];
  following?: string[];
}

export const usersAPI = {
  // Get user by ID
  async getById(id: string) {
    return apiClient.get<User>(`/users/${id}`);
  },

  // Get all users
  async getAll(page = 1, limit = 20) {
    return apiClient.get<{ items: User[]; meta: any }>('/users', { page, limit });
  },

  // Update user
  async update(id: string, data: Partial<User>) {
    return apiClient.put<User>(`/users/${id}`, data);
  },

  // Delete user
  async delete(id: string) {
    return apiClient.delete(`/users/${id}`);
  },

  // Follow user
  async follow(userId: string) {
    return apiClient.post(`/users/${userId}/follow`, {});
  },

  // Unfollow user
  async unfollow(userId: string) {
    return apiClient.delete(`/users/${userId}/follow`);
  },

  // Get user's followers
  async getFollowers(userId: string) {
    return apiClient.get<User[]>(`/users/${userId}/followers`);
  },
  // Get user's following
  async getFollowing(userId: string) {
    return apiClient.get<User[]>(`/users/${userId}/following`);
  },
};
