import { useAppDispatch } from '../../hooks/redux-hooks';
import { deleteCell, moveCell } from '../../store/slices/cell-slice';

import './action-bar.css';

interface ActionBarProps {
  id: string;
}

function ActionBar({ id }: ActionBarProps) {
  const dispatch = useAppDispatch();

  return (
    <div className='action-bar'>
      <button
        className='button is-primary is-small'
        onClick={() => dispatch(moveCell({ id: id, direction: 'up' }))}
      >
        <span className='icon'>
          <i className='fas fa-arrow-up'></i>
        </span>
      </button>
      <button
        className='button is-primary is-small'
        onClick={() => dispatch(moveCell({ id: id, direction: 'down' }))}
      >
        <span className='icon'>
          <i className='fas fa-arrow-down'></i>
        </span>
      </button>
      <button
        className='button is-primary is-small'
        onClick={() => dispatch(deleteCell({ id }))}
      >
        <span className='icon'>
          <i className='fas fa-times'></i>
        </span>
      </button>
    </div>
  );
}

export default ActionBar;
