import { useEffect, useRef } from "react";
import "./preview.css";
interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

const html = `
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
        console.error(err)
      }

      // Asyncrhonous Code Errors
      window.addEventListener('error', (event) => {
        event.preventDefault(); // Prevent browser from showing "Uncaught Reference Error"
        console.log(handleError(event.error))
      })

      window.addEventListener('message', (event)=> {
        try {
          eval (event.data);
        } catch (err) {
          handleError(err);
        }
      }, false)
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStatus && (
        <div className="preview-error">
          <h1>Compilation Error</h1>
          {bundlingStatus}
        </div>
      )}
    </div>
  );
};

export default Preview;
