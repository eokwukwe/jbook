import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';

import bundler from '../../bundler';

export interface BundlerResult {
  code: string;
  error: string;
}

export interface Bundle extends BundlerResult {
  bundling: boolean;
}

export interface BundlesState {
  [key: string]: Bundle | undefined;
}

const initialState: BundlesState = {};

export const createBundle = createAsyncThunk(
  'bundles/createBundle',
  async (payload: { cellId: string; input: string }) => {
    const { cellId, input } = payload;
    const result = await bundler(input);

    return { cellId, bundle: result };
  }
);

const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    bundleStart: (state, action: PayloadAction<{ cellId: string }>) => {
      state[action.payload.cellId] = {
        bundling: true,
        code: '',
        error: '',
      };
    },
    bundleComplete: (
      state,
      action: PayloadAction<{ cellId: string; bundle: BundlerResult }>
    ) => {
      state[action.payload.cellId] = {
        bundling: false,
        code: action.payload.bundle.code,
        error: action.payload.bundle.error,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBundle.pending, (state, action) => {
      state[action.meta.arg.cellId] = {
        bundling: true,
        code: '',
        error: '',
      };
    });

    builder.addCase(createBundle.fulfilled, (state, action) => {
      state[action.payload.cellId] = {
        bundling: false,
        code: action.payload.bundle.code,
        error: action.payload.bundle.error,
      };
    });
  },
});

const selectBundlesState = (state: BundlesState) => state;

export const { bundleStart, bundleComplete } = bundlesSlice.actions;

export const selectBundleByCellId = createSelector(
  selectBundlesState,
  (_: BundlesState, cellId: string) => cellId,
  (bundles, cellId) => bundles[cellId]
);

export default bundlesSlice.reducer;
