import * as UI from "ui-composer"
import { StartScreen } from "./lib/StartScreen"
import { GameState, SidebarTunnel } from "./state"

/* We need to make sure that this file imports _something_ from @react-three/fiber
because otherwise Vite gets confused. :( */
import "@react-three/fiber"
import { Game } from "./Game"

export const App = () => {
  return (
    <StartScreen>
      <UI.Root>
        <UI.HorizontalGroup>
          <div style={{ flex: 2 }}>
            <Game />
          </div>

          <UI.HorizontalResizer />

          <UI.VerticalGroup css={{ flex: 1 }}>
            <UI.Panel>
              <UI.Heading>Scenes</UI.Heading>
              <UI.VerticalGroup>
                <UI.Button onClick={() => GameState.enter("menu")}>
                  Menu Scene
                </UI.Button>
                <UI.Button onClick={() => GameState.enter("gameplay")}>
                  Gameplay Scene
                </UI.Button>
              </UI.VerticalGroup>
            </UI.Panel>

            <SidebarTunnel.Out />
          </UI.VerticalGroup>
        </UI.HorizontalGroup>
      </UI.Root>
    </StartScreen>
  )
}
