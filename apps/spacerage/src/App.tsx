import { PerspectiveCamera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as AC from "audio-composer"
import { AudioListener } from "audio-composer"
import { lazy, Suspense, useEffect } from "react"
import * as RC from "render-composer"
import * as UI from "ui-composer"
import { PostProcessing } from "./common/PostProcessing"
import { Stage } from "./configuration"
import { controller } from "./input"
import { StartScreen } from "./lib/StartScreen"
import { useCapture } from "./lib/useCapture"
import { GameState, SidebarTunnel, store } from "./state"

const MenuScene = lazy(() => import("./scenes/menu/MenuScene"))
const GameplayScene = lazy(() => import("./scenes/gameplay/GameplayScene"))

const Controls = () => {
  useEffect(() => {
    controller.start()
    return () => controller.stop()
  })

  useFrame(() => {
    controller.update()
  }, Stage.Early)

  return null
}

export const App = () => {
  return (
    <StartScreen>
      <UI.Root>
        <UI.HorizontalGroup>
          <div style={{ flex: 2 }}>
            <RC.Canvas dpr={1}>
              <Controls />

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
