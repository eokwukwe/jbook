import { useAppDispatch } from '../../hooks/redux-hooks';
import { insertCellAfter } from '../../store/slices/cell-slice';

import './add-cell.css';

interface AddCellProps {
  forceVisible?: boolean;
  previousCellId: string | null;
}

function AddCell({ forceVisible, previousCellId }: AddCellProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className='add-buttons'>
        <button
          className='button is-rounded is-primary is-small'
          onClick={() =>
            dispatch(insertCellAfter({ id: previousCellId, type: 'code' }))
          }
        >
          <span className='icon is-small'>
            <i className='fas fa-plus' />
          </span>
          <span>Code</span>
        </button>
        <button
          className='button is-rounded is-primary is-small'
          onClick={() =>
            dispatch(insertCellAfter({ id: previousCellId, type: 'text' }))
          }
        >
          <span className='icon is-small'>
            <i className='fas fa-plus' />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className='divider'></div>
    </div>
  );
}

export default AddCell;
