import { PerspectiveCamera } from "@react-three/drei"
import * as AC from "audio-composer"
import { AudioListener } from "audio-composer"
import { Controller } from "input-composer/react"
import { lazy, Suspense } from "react"
import * as RC from "render-composer"
import * as UI from "ui-composer"
import { PostProcessing } from "./common/PostProcessing"
import { Stage } from "./configuration"
import { controller } from "./input"
import { StartScreen } from "./lib/StartScreen"
import { useCapture } from "./lib/useCapture"
import { GameState, SidebarTunnel, store } from "./state"
import "@react-three/fiber"

const MenuScene = lazy(() => import("./scenes/menu/MenuScene"))
const GameplayScene = lazy(() => import("./scenes/gameplay/GameplayScene"))

export const App = () => {
  return (
    <StartScreen>
      <UI.Root>
        <UI.HorizontalGroup>
          <div style={{ flex: 2 }}>
            <RC.Canvas dpr={1}>
              <Controller
                controller={controller}
                updatePriority={Stage.Early}
              />
              <RC.RenderPipeline updatePriority={Stage.Render}>
                <AC.AudioContext>
                  <AC.Compressor>
                    {/* <AC.Reverb seconds={2} decay={5}> */}
                    <PostProcessing />
                    <Suspense>
                      <PerspectiveCamera
                        position={[0, 0, 20]}
                        rotation-y={-0.8}
                        makeDefault
                        ref={useCapture(store, "camera")}
                      >
                        <AudioListener />
                      </PerspectiveCamera>

                      <GameState.Match state="menu">
                        <Suspense>
                          <MenuScene />
                        </Suspense>
                      </GameState.Match>

                      <GameState.Match state="gameplay">
                        <Suspense>
                          <GameplayScene />
                        </Suspense>
                      </GameState.Match>

                      {/* <Perf matrixUpdate /> */}
                    </Suspense>
                    {/* </AC.Reverb> */}
                  </AC.Compressor>
                </AC.AudioContext>
              </RC.RenderPipeline>
            </RC.Canvas>
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
