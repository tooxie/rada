import { FunctionComponent, h } from "preact";
import { IntlProvider } from "preact-i18n";

import definition from "../i18n/es.json";
import Router from "./router";

const App: FunctionComponent = () => {
  return (
    <IntlProvider definition={definition}>
      <div id="preact_root">
        <Router />
      </div>
    </IntlProvider>
  );
};

export default App;
