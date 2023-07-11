import { Fragment, useEffect } from 'react';

import AddCell from '../add-cell';
import CellListItem from '../cell-list-item';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCells, selectOrderedCells } from '../../store/slices/cell-slice';

import './cell-list.css';

function CellList() {
  const dispatch = useAppDispatch();
  const cells = useAppSelector(selectOrderedCells);

  console.log('cells', cells);
  

  useEffect(() => {
    dispatch(fetchCells());
  }, [dispatch]);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className='cell-list'>
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
}

export default CellList;
