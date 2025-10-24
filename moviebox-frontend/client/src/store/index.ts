import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './features/moviesSlice';
import tvShowsReducer from './features/tvShowsSlice';
import watchlistReducer from './features/watchlistSlice';
import historyReducer from './features/historySlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    tvShows: tvShowsReducer,
    watchlist: watchlistReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
