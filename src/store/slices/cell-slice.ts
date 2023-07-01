import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

const selectData = (state: RootState) => state.cells.data;
const selectOrder = (state: RootState) => state.cells.order;

export const { moveCell, updateCell, deleteCell, insertCellAfter } =
  cellSlice.actions;

export const selectCells = createSelector(
  [selectOrder, selectData],
  (order, data) => order.map((id) => data[id])
);

export default cellSlice.reducer;
