import React from "react"
import ReactDOM from "react-dom/client"
import * as SC from "shader-composer"
import { App } from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

SC.enableDebugging()
