import { useEffect } from 'react';

import Resizable from '../resizable';
import Preview from '../code-preview';
import CodeEditor from '../code-editor';

import {
  createBundle,
  selectBundleByCellId,
} from '../../store/slices/bundle-slice';
import { Cell, updateCell } from '../../store/slices/cell-slice';
import { useAppDispatch, useAppSelector, useCumulativeCode } from '../../hooks';

import './code-cell.css';

interface CodeCellProps {
  cell: Cell;
}

export default function CodeCell({ cell }: CodeCellProps) {
  const dispatch = useAppDispatch();

  const bundle = useAppSelector((state) =>
    selectBundleByCellId(state.bundles, cell.id)
  );

  const cumulativeCode = useCumulativeCode(cell.id);
  console.log('bundle', { cellId: cell.id, bundle, cumulativeCode });

  useEffect(() => {
    if (!bundle) {
      dispatch(createBundle({ cellId: cell.id, input: cumulativeCode }));
      return;
    }

    const timer = setTimeout(async () => {
      dispatch(createBundle({ cellId: cell.id, input: cumulativeCode }));
    }, 750);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) =>
              dispatch(updateCell({ id: cell.id, content: value }))
            }
          />
        </Resizable>

        <div className='progress-wrapper'>
          {!bundle || bundle.bundling ? (
            <div className='progress-cover'>
              <progress className='progress is-small is-primary' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.error} cellId={cell.id} />
          )}
        </div>
      </div>
    </Resizable>
  );
}
