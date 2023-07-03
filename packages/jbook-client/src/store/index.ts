import { configureStore } from '@reduxjs/toolkit';

import cellReducer from './slices/cell-slice';
import bundleReducer from './slices/bundle-slice';

const store = configureStore({
  reducer: {
    cells: cellReducer,
    bundles: bundleReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

store.dispatch({
  type: 'editor-cell/insertCellAfter',
  payload: {
    id: null,
    type: 'code',
  },
});

store.dispatch({
  type: 'editor-cell/insertCellAfter',
  payload: {
    id: null,
    type: 'text',
  },
});
