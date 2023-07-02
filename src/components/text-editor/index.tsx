import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect, useRef } from 'react';

import { useAppDispatch } from '../../hooks';
import { Cell, updateCell } from '../../store/slices/cell-slice';

import './text-editor.css';
interface TextEditorProps {
  cell: Cell;
}

function TextEditor({ cell }: TextEditorProps) {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        editorRef.current &&
        event.target &&
        editorRef.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className='text-editor' ref={editorRef}>
        <MDEditor
          value={cell.content}
          onChange={(v) =>
            dispatch(updateCell({ id: cell.id, content: v ?? '' }))
          }
        />
      </div>
    );
  }

  return (
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || '> Click to Edit'} />
      </div>
    </div>
  );
}

export default TextEditor;
