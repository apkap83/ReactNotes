import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./state";
import CellList from "./components/cell-list";

const App = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Provider store={store}>
      <div>
        <CellList />
        <footer>
          {/* Made with &nbsp;<span style={{ fontSize: "2rem" }}>&hearts;</span>
          &nbsp;&nbsp; */}
          <a
            href="mailto: ap.kapetanios@gmail.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            Apostolos Kapetanios
          </a>{" "}
          &nbsp;
        </footer>
      </div>
    </Provider>
  );
};

const el = document.getElementById("root");

const root = ReactDOM.createRoot(el!);

root.render(<App />);
