import "./style/reset.css";
import "./style/index.css";
import App from "./components/app";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
});

export default App;
