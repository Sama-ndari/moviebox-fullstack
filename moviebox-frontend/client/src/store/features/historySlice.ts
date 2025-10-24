import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/queryClient';
import { WatchHistoryItem } from '@/lib/types';

interface HistoryState {
  items: WatchHistoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWatchHistory = createAsyncThunk(
  'history/fetch',
  async () => {
    const res = await apiRequest('GET', '/api/history');
    return await res.json();
  }
);

export const addToWatchHistory = createAsyncThunk(
  'history/add',
  async (params: { itemId: number, itemType: string, progress: number, duration: number }) => {
    const res = await apiRequest('POST', '/api/history', params);
    return await res.json();
  }
);

export const updateWatchProgress = createAsyncThunk(
  'history/update',
  async (params: { historyId: number, progress: number }) => {
    const res = await apiRequest('PATCH', `/api/history/${params.historyId}`, { progress: params.progress });
    return await res.json();
  }
);

export const clearWatchHistory = createAsyncThunk(
  'history/clear',
  async () => {
    await apiRequest('DELETE', '/api/history');
    return true;
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Watch History
      .addCase(fetchWatchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action: PayloadAction<WatchHistoryItem[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch watch history';
      })
      
      // Add to Watch History
      .addCase(addToWatchHistory.fulfilled, (state, action: PayloadAction<WatchHistoryItem>) => {
        // Remove any existing history item for the same content
        state.items = state.items.filter(
          item => !(item.itemId === action.payload.itemId && item.itemType === action.payload.itemType)
        );
        // Add the new history item
        state.items.unshift(action.payload);
      })
      
      // Update Watch Progress
      .addCase(updateWatchProgress.fulfilled, (state, action: PayloadAction<WatchHistoryItem>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Clear Watch History
      .addCase(clearWatchHistory.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default historySlice.reducer;
