import CodeCell from '../code-cell';
import ActionBar from '../action-bar';
import TextEditor from '../text-editor';

import { Cell } from '../../store/slices/cell-slice';

import './cell-list-item.css';

interface CellListItemProps {
  cell: Cell;
}

function CellListItem({ cell }: CellListItemProps) {
  let child: JSX.Element;

  if (cell.type === 'code') {
    child = (
      <>
        <div className='action-bar-wrapper'>
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }

  return <div className='cell-list-item'>{child}</div>;
}

export default CellListItem;
