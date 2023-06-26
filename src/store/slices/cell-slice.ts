import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../index';

export type CellTypes = 'code' | 'text';
export type CellDirections = 'up' | 'down';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}

interface CellsState {
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

export const cellSlice = createSlice({
  name: 'editor-cell',
  initialState,
  reducers: {
    updateCell: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      state.data[action.payload.id] = {
        type: 'code',
        id: action.payload.id,
        content: action.payload.content,
      };
    },

    // moveCell: (
    //   state,
    //   action: PayloadAction<{ id: string; direction: CellDirections }>
    // ) => {
    //   return state;
    // },

    // deleteCell: (state, action: PayloadAction<{ id: string }>) => {
    //   return state;
    // },

    // insertCellBefore: (
    //   state,
    //   action: PayloadAction<{ id: string; type: CellTypes }>
    // ) => {
    //   return state;
    // },
  },
});

export const { updateCell } = cellSlice.actions;
export const selectCell = (state: RootState) => state.cells;

export default cellSlice.reducer;
