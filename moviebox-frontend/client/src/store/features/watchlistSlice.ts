import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/queryClient';
import { WatchlistItem } from '@/lib/types';

interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async () => {
    const res = await apiRequest('GET', '/api/watchlist');
    return await res.json();
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async (params: { itemId: number, itemType: string }) => {
    const res = await apiRequest('POST', '/api/watchlist', params);
    return await res.json();
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/remove',
  async (watchlistItemId: number) => {
    await apiRequest('DELETE', `/api/watchlist/${watchlistItemId}`);
    return watchlistItemId;
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Watchlist
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action: PayloadAction<WatchlistItem[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch watchlist';
      })
      
      // Add to Watchlist
      .addCase(addToWatchlist.fulfilled, (state, action: PayloadAction<WatchlistItem>) => {
        state.items.push(action.payload);
      })
      
      // Remove from Watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;
