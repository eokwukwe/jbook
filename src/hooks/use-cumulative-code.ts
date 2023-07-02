import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '.';
import { RootState } from '../store';
import { selectOrderedCells } from '../store/slices/cell-slice';

export function makeSelectCumulativeCode() {
  return createSelector(
    selectOrderedCells,
    (_: RootState, cellId: string) => cellId,
    (orderedCells, cellId) => {
      const showFunc = `
        // Use _React and _ReactDOM to avoid name collisions
        // when a user imports React and ReactDOM in their code

        import _React from 'react';
        import _ReactDOM from 'react-dom';

        var show = (value) => {
          const root = document.querySelector('#root');

          if (typeof value === 'object') {
            // if it's a React component
            if (value.$$typeof && value.props) {
              _ReactDOM.render(value, root);
            } else {
              // if it's a plain object
              root.innerHTML = JSON.stringify(value);
            }
          } else {
            // if it's a string or number
            root.innerHTML = value;
          }
        };
      `;

      const cumulativeCode = [];
      const showFuncNoop = 'var show = () => {}';

      for (const cell of orderedCells) {
        if (cell.type === 'code') {
          /**
           * If this is the cell we're currently executing, push the showFunc
           * to the cumulativeCode array.
           */
          if (cell.id === cellId) {
            cumulativeCode.push(showFunc);
          } else {
            /**
             * If this is not the cell we're currently executing, push the showFuncNoop
             * to the cumulativeCode array. This is to ensure that the output of the
             * showFun in one cell does not show in the cells after it.
             *
             * E.g. The out of the showFunc in cell #1 will not be shown in cell #2
             * and so on.
             */
            cumulativeCode.push(showFuncNoop);
          }
          // add the cell's code
          cumulativeCode.push(cell.content);
        }

        // stop when we reach the current cell
        if (cell.id === cellId) {
          break;
        }
      }

      return cumulativeCode.join('\n');
    }
  );
}

/**
 * To be able to reference a variable/code declared in a cell from cells after it,
 * we want to bundle the code from previous cells together with code from the 
 * current cell. 
 * 
 * So, for each cell, we want to bundle the code from all previous cells and the
 * code from the current cell. This will allow us to reference variables from
 * previous cells. E.g. If we define a variable in cell #1, we can reference
 * it in cell #2.
 */
export function useCumulativeCode(cellId: string) {
  const selectCumulativeCode = useMemo(makeSelectCumulativeCode, []);
  return useAppSelector((state) => selectCumulativeCode(state, cellId));
}
