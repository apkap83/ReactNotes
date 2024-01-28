import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;

    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';

    var show = (value) => {
      const el = document.querySelector("#root");

      if (typeof value === 'object') {
        // For JSX
        if (value.$$typeof && value.props) {
          const root = _ReactDOM.createRoot(el);
          root.render(value)
        } else {
            // For Object
          el.innerHTML = JSON.stringify(value);
        }
      } else {
        // For Everything Else
        el.innerHTML = value;
      }
    }
  `;

    const showFuncNoOp = "var show = () => {}";

    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoOp);
        }

        cumulativeCode.push(c.content);
      }

      if (c.id === cellId) {
        break;
      }
    }

    return cumulativeCode;
  }).join("\n");
};
