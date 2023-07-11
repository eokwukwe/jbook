import {
  AnyAction,
  Dispatch,
  Middleware,
  ThunkDispatch,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import cellReducer from './slices/cell-slice';
import bundleReducer from './slices/bundle-slice';
import { saveCellsMiddleware } from './middleware/save-cells-middleware';

const rootReducer = combineReducers({
  cells: cellReducer,
  bundles: bundleReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(saveCellsMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type MyDispatch = Dispatch & ThunkDispatch<RootState, null, AnyAction>;
export type AppMiddleware = Middleware<object, RootState, MyDispatch>;


export type AppDispatch = typeof store.dispatch;
// This is to avoid circular dependency that would occur if we
// were to use type RootState = ReturnType<typeof store.getState>
export type RootState = ReturnType<typeof rootReducer>;

export default store;