import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '../index';
import { randomId } from '../../helpers';
import axios from 'axios';

export type CellTypes = 'code' | 'text';
export type CellDirections = 'up' | 'down';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}

export interface CellsState {
  order: string[];
  loading: boolean;
  error: string | null;
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

export const fetchCells = createAsyncThunk(
  'editor-cell/fetchCells',
  async () => {
    const { data }: { data: Cell[] } = await axios.get('/cells');
    return data;
  }
);

// // Create async thunk for saving cells
// export const saveCells = createAsyncThunk(
//   'editor-cell/saveCells',
//   async (cells: Cell[]) => {
//     await axios.post('/cells', { cells });
//   }
// );

export const saveCells = createAsyncThunk(
  'editor-cell/saveCells',
  async (_, { getState, rejectWithValue }) => {
    const {
      cells: { data, order },
    } = getState() as RootState;

    const cells = order.map((id) => data[id]);

    try {
      await axios.post('/cells', { cells });
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const cellSlice = createSlice({
  name: 'editor-cell',
  initialState,
  reducers: {
    saveCellsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    fetchCellsStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchCellsComplete(state, action: PayloadAction<Cell[]>) {
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
    },

    fetchCellsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateCell: (
      state,
      { payload }: PayloadAction<{ id: string; content: string }>
    ) => {
      state.data[payload.id].content = payload.content;
    },

    deleteCell: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state.data[payload.id];
      state.order = state.order.filter((id) => id !== payload.id);
    },

    moveCell: (
      state,
      { payload }: PayloadAction<{ id: string; direction: CellDirections }>
    ) => {
      const index = state.order.findIndex((id) => id === payload.id);
      const targetIndex = payload.direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) return;

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = payload.id;
    },

    insertCellAfter: (
      state,
      { payload }: PayloadAction<{ id: string | null; type: CellTypes }>
    ) => {
      const cell: Cell = {
        content: '',
        id: randomId(),
        type: payload.type,
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex((id) => id === payload.id);

      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCells.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCells.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.map((cell) => cell.id);
        state.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell;
          return acc;
        }, {} as CellsState['data']);
      })
      .addCase(fetchCells.rejected, (state, action) => {
        console.log('fetchCells.rejected', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveCells.rejected, (state, action) => {
        console.log('saveCells.rejected', action.payload);
        state.error = action.payload as string;
      });
  },
});

const selectData = (state: RootState) => state.cells.data;
const selectOrder = (state: RootState) => state.cells.order;

export const {
  moveCell,
  updateCell,
  deleteCell,
  saveCellsError,
  insertCellAfter,
  fetchCellsStart,
  fetchCellsError,
  fetchCellsComplete,
} = cellSlice.actions;

export const selectOrderedCells = createSelector(
  [selectOrder, selectData],
  (order, data) => order.map((id) => data[id])
);

export default cellSlice.reducer;
