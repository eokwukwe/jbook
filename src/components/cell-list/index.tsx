import { Fragment } from 'react';

import AddCell from '../add-cell';
import CellListItem from '../cell-list-item';

import { useAppSelector } from '../../hooks';
import { selectOrderedCells } from '../../store/slices/cell-slice';

import './cell-list.css';

function CellList() {
  const cells = useAppSelector(selectOrderedCells);

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
