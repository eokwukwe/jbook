import { configureStore } from '@reduxjs/toolkit';
import cellReducer from './slices/cell-slice';

const store = configureStore({
  reducer: {
    cells: cellReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
