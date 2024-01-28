import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";
import { randomId } from "../../utils/randomId";

interface CellsState {
  data: {
    [key: string]: Cell;
  };
  order: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CellsState = {
  data: {},
  order: [],
  loading: false,
  error: null,
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.INSERT_CELL_AFTER:
        let cell;
        const cellForCode: Cell = {
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => <h1>Hi there!</h1>

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
root.render(<App />)
                      `,
          // content: "",
          type: action.payload.type,
          id: randomId(),
        };

        const cellForText: Cell = {
          content: `# Markdown Editor
- Click To edit!
          `,
          type: action.payload.type,
          id: randomId(),
        };

        if (action.payload.type === "code") {
          cell = cellForCode;
        } else {
          cell = cellForText;
        }

        state.data[cell.id] = cell;
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );

        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;

        state.data[id].content = content;
        return state;

      // Immer Equivalent of the below return in comment
      /*
      // return {
      //   ...state,
      //   data: {
      //     ...state.data,
      //     [id]: {
      //       ...state.data[id],
      //       content: content,
      //     },
      //   },
      // };
      */
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);

        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;

        return state;

      default:
        return state;
    }
  },
  initialState
);

export default reducer;
