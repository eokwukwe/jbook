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

const randomId = () => Math.random().toString(36).substring(2);

export const cellSlice = createSlice({
  name: 'editor-cell',
  initialState,
  reducers: {
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

    insertCellBefore: (
      state,
      { payload }: PayloadAction<{ id: string; type: CellTypes }>
    ) => {
      const cell: Cell = {
        id: randomId(),
        type: payload.type,
        content: '',
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex((id) => id === payload.id);

      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }
    },
  },
});

export const { updateCell } = cellSlice.actions;
export const selectCell = (state: RootState) => state.cells;

export default cellSlice.reducer;
