import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/queryClient';
import { Movie } from '@/lib/types';

interface MoviesState {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
  byGenre: Record<number, Movie[]>;
  details: Record<number, Movie>;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  trending: [],
  popular: [],
  topRated: [],
  upcoming: [],
  byGenre: {},
  details: {},
  loading: false,
  error: null,
};

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async () => {
    const res = await apiRequest('GET', '/api/movies/trending');
    return await res.json();
  }
);

export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async () => {
    const res = await apiRequest('GET', '/api/movies/popular');
    return await res.json();
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRated',
  async () => {
    const res = await apiRequest('GET', '/api/movies/top-rated');
    return await res.json();
  }
);

export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcoming',
  async () => {
    const res = await apiRequest('GET', '/api/movies/upcoming');
    return await res.json();
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchByGenre',
  async (genreId: number) => {
    const res = await apiRequest('GET', `/api/movies/genre/${genreId}`);
    const data = await res.json();
    return { genreId, movies: data };
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId: number) => {
    const res = await apiRequest('GET', `/api/movies/${movieId}`);
    return await res.json();
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Trending Movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.trending = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending movies';
      })
      
      // Popular Movies
      .addCase(fetchPopularMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.popular = action.payload;
        state.loading = false;
      })
      
      // Top Rated Movies
      .addCase(fetchTopRatedMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.topRated = action.payload;
        state.loading = false;
      })
      
      // Upcoming Movies
      .addCase(fetchUpcomingMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.upcoming = action.payload;
        state.loading = false;
      })
      
      // Movies by Genre
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.byGenre[action.payload.genreId] = action.payload.movies;
        state.loading = false;
      })
      
      // Movie Details
      .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.details[action.payload.id] = action.payload;
        state.loading = false;
      });
  },
});

export default moviesSlice.reducer;
