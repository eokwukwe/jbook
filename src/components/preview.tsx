import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

const iframeHTML = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef() as React.MutableRefObject<HTMLIFrameElement>;

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = iframeHTML;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      iframeRef.current.contentWindow!.postMessage(code, '*');
    }
  }, [code]);

  return (
    <iframe
      title='preview'
      ref={iframeRef}
      sandbox='allow-scripts'
      srcDoc={iframeHTML}
    />
  );
};

export default Preview;
