import * as UI from "ui-composer"
import { StartScreen } from "./lib/StartScreen"

/* We need to make sure that this file imports _something_ from @react-three/fiber
because otherwise Vite gets confused. :( */
import "@react-three/fiber"
import { Game } from "./Game"
import { Sidebar } from "./editor/Sidebar"

export const App = () => {
  return (
    <StartScreen>
      <UI.Root>
        <UI.HorizontalGroup>
          <div style={{ flex: 4 }}>
            <Game />
          </div>
          <UI.HorizontalResizer />
          <UI.VerticalGroup css={{ flex: "1 1 auto" }}>
            <Sidebar />
          </UI.VerticalGroup>
        </UI.HorizontalGroup>
      </UI.Root>
    </StartScreen>
  )
}
