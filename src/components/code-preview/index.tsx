import { useRef, useEffect } from 'react';

import './preview.css';

interface PreviewProps {
  code: string;
  error: string;
}

const iframeHTML = `
    <html>
      <head>
       <style>html { background-color: white; }</style>
      </head>

      <body>
        <div id="root"></div>

        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

function Preview({ code, error }: PreviewProps) {
  const iframeRef = useRef() as React.MutableRefObject<HTMLIFrameElement>;

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = iframeHTML;

      // Add a delay to allow the iframe to load before sending the message
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        iframeRef.current.contentWindow!.postMessage(code, '*');
      }, 50);
    }
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='preview'
        ref={iframeRef}
        sandbox='allow-scripts'
        srcDoc={iframeHTML}
      />
      {error && <div className='preview-error'>{error}</div>}
    </div>
  );
}

export default Preview;
