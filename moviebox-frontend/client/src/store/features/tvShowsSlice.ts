import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/queryClient';
import { TvShow } from '@/lib/types';

interface TvShowsState {
  trending: TvShow[];
  popular: TvShow[];
  topRated: TvShow[];
  airingToday: TvShow[];
  byGenre: Record<number, TvShow[]>;
  details: Record<number, TvShow>;
  loading: boolean;
  error: string | null;
}

const initialState: TvShowsState = {
  trending: [],
  popular: [],
  topRated: [],
  airingToday: [],
  byGenre: {},
  details: {},
  loading: false,
  error: null,
};

export const fetchTrendingTvShows = createAsyncThunk(
  'tvShows/fetchTrending',
  async () => {
    const res = await apiRequest('GET', '/api/tv/trending');
    return await res.json();
  }
);

export const fetchPopularTvShows = createAsyncThunk(
  'tvShows/fetchPopular',
  async () => {
    const res = await apiRequest('GET', '/api/tv/popular');
    return await res.json();
  }
);

export const fetchTopRatedTvShows = createAsyncThunk(
  'tvShows/fetchTopRated',
  async () => {
    const res = await apiRequest('GET', '/api/tv/top-rated');
    return await res.json();
  }
);

export const fetchAiringTodayTvShows = createAsyncThunk(
  'tvShows/fetchAiringToday',
  async () => {
    const res = await apiRequest('GET', '/api/tv/airing-today');
    return await res.json();
  }
);

export const fetchTvShowsByGenre = createAsyncThunk(
  'tvShows/fetchByGenre',
  async (genreId: number) => {
    const res = await apiRequest('GET', `/api/tv/genre/${genreId}`);
    const data = await res.json();
    return { genreId, tvShows: data };
  }
);

export const fetchTvShowDetails = createAsyncThunk(
  'tvShows/fetchDetails',
  async (tvShowId: number) => {
    const res = await apiRequest('GET', `/api/tv/${tvShowId}`);
    return await res.json();
  }
);

const tvShowsSlice = createSlice({
  name: 'tvShows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Trending TV Shows
      .addCase(fetchTrendingTvShows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingTvShows.fulfilled, (state, action: PayloadAction<TvShow[]>) => {
        state.trending = action.payload;
        state.loading = false;
      })
      .addCase(fetchTrendingTvShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending TV shows';
      })
      
      // Popular TV Shows
      .addCase(fetchPopularTvShows.fulfilled, (state, action: PayloadAction<TvShow[]>) => {
        state.popular = action.payload;
        state.loading = false;
      })
      
      // Top Rated TV Shows
      .addCase(fetchTopRatedTvShows.fulfilled, (state, action: PayloadAction<TvShow[]>) => {
        state.topRated = action.payload;
        state.loading = false;
      })
      
      // Airing Today TV Shows
      .addCase(fetchAiringTodayTvShows.fulfilled, (state, action: PayloadAction<TvShow[]>) => {
        state.airingToday = action.payload;
        state.loading = false;
      })
      
      // TV Shows by Genre
      .addCase(fetchTvShowsByGenre.fulfilled, (state, action) => {
        state.byGenre[action.payload.genreId] = action.payload.tvShows;
        state.loading = false;
      })
      
      // TV Show Details
      .addCase(fetchTvShowDetails.fulfilled, (state, action: PayloadAction<TvShow>) => {
        state.details[action.payload.id] = action.payload;
        state.loading = false;
      });
  },
});

export default tvShowsSlice.reducer;
