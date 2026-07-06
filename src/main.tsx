import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import BrokenImport from "./file-yang-benar-benar-tidak-ada";

createRoot(document.getElementById("root")!).render(<App />);
