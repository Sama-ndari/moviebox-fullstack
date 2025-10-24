import { apiClient } from '@/lib/apiClient';

export interface Person {
  _id: string;
  name: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
  profileImageUrl?: string;
  knownFor: string;
  gender?: string;
  placeOfBirth?: string;
  popularity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  followers?: string[];
}

export interface PaginatedPeople {
  items: Person[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const personAPI = {
  // Get all people with pagination
  async getAll(page = 1, limit = 20) {
    return apiClient.get<PaginatedPeople>('/person', { page, limit });
  },

  // Get person by ID
  async getById(id: string) {
    return apiClient.get<Person>(`/person/${id}`);
  },

  // Search people
  async search(query: string) {
    return apiClient.get<Person[]>('/person/search', { query });
  },

  // Follow a person
  async follow(personId: string) {
    return apiClient.post(`/person/${personId}/follow`);
  },

  // Unfollow a person
  async unfollow(personId: string) {
    return apiClient.delete(`/person/${personId}/follow`);
  },

  // Get person's movies
  async getMovies(personId: string) {
    return apiClient.get(`/person/${personId}/movies`);
  },

  // Get person's TV shows
  async getTVShows(personId: string) {
    return apiClient.get(`/person/${personId}/tv-shows`);
  },

  // Get person's followers
  async getFollowers(personId: string) {
    return apiClient.get(`/person/${personId}/followers`);
  },

  // Get popular people
  async getPopular(limit = 20) {
    return apiClient.get<Person[]>('/person/popular', { limit });
  },
};
