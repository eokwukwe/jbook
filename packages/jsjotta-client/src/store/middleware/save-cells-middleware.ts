import {} from '@reduxjs/toolkit';
import { saveCells } from '../slices/cell-slice';
import debounce from 'lodash.debounce';
import { AppMiddleware } from '..';

const saveCellsDebounced = debounce(async (storeAPI) => {
  await storeAPI.dispatch(saveCells());
}, 750);

export const saveCellsMiddleware: AppMiddleware = (storeAPI) => {
  return (next) => {
    return async (action) => {
      next(action);

      if (
        [
          'editor-cell/moveCell',
          'editor-cell/updateCell',
          'editor-cell/deleteCell',
          'editor-cell/insertCellAfter',
        ].includes(action.type)
      ) {
        await saveCellsDebounced(storeAPI);
      }
    };
  };
};
