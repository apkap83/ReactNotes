import "./code-cell.css";
import { useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
// import bundle from "../bundler";
import Resizable from "./resizable";
import { Cell } from "../state";

import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";
import { useCumulativeCode } from "../hooks/use-cumulative-code";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // const [code, setCode] = useState("");
  // const [err, setErr] = useState("");

  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  // const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(async () => {
      // const output = await bundle(cell.content);
      // setCode(output.code);
      // setErr(output.err);

      createBundle(cell.id, cell.content);
    }, 555);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.content, cell.id, createBundle]);

  // const onClick = async () => {};

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 15px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundlingStatus={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
