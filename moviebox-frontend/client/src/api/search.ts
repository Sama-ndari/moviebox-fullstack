import { apiClient } from '@/lib/apiClient';
import { Movie } from './movies';
import { TVShow } from './tvshows';

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
}

export interface SearchResults {
  movies: Movie[];
  tvShows: TVShow[];
  people: Person[];
}

export const searchAPI = {
  // Global search across movies, TV shows, and people
  async search(query: string, page = 1, limit = 20) {
    return apiClient.get<SearchResults>('/search', { query, page, limit });
  },

  // Search movies only
  async searchMovies(query: string) {
    return apiClient.get<Movie[]>('/movies/search', { query });
  },

  // Search TV shows only
  async searchTVShows(query: string) {
    return apiClient.get<TVShow[]>('/tv-shows/search', { query });
  },

  // Search people only
  async searchPeople(query: string) {
    return apiClient.get<Person[]>('/person/search', { query });
  },
};
