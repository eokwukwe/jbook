import { useState, useEffect } from 'react';

import Preview from '../code-preview';
import Resizable from '../resizable';
import CodeEditor from '../code-editor';

import bundler from '../../bundler';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { Cell, updateCell } from '../../store/slices/cell-slice';

interface CodeCellProps {
  cell: Cell;
}

export default function CodeCell({ cell }: CodeCellProps) {
  const dispatch = useAppDispatch();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundler(cell.content);

      setCode(output.code);
      setError(output.error);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cell.content]);

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
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
}
