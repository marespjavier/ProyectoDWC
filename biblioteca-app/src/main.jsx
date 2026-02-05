import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShelfProvider } from "./context/ShelfContext.jsx";
import "../src/styles/styles.css";

/*
  Punto de entrada de React.
  - BrowserRouter: habilita rutas.
  - ShelfProvider: estado global de la estantería (persistido en localStorage).
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShelfProvider>
        <App />
      </ShelfProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
