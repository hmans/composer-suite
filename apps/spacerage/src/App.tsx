import { PerspectiveCamera } from "@react-three/drei"
import * as AC from "audio-composer"
import { AudioListener } from "audio-composer"
import { useInput } from "input-composer"
import { Perf } from "r3f-perf"
import { lazy, Suspense } from "react"
import * as RC from "render-composer"
import { PostProcessing } from "./common/PostProcessing"
import { Stage } from "./configuration"
import { input } from "./input"
import { StartScreen } from "./lib/StartScreen"
import { useCapture } from "./lib/useCapture"
import { GameState, store } from "./state"
import * as UI from "ui-composer"

const MenuScene = lazy(() => import("./scenes/menu/MenuScene"))
const GameplayScene = lazy(() => import("./scenes/gameplay/GameplayScene"))

export const App = () => {
  /* Mount input */
  useInput(input)

  return (
    <StartScreen>
      <UI.Root>
        <UI.HorizontalGroup>
          <div style={{ flex: 2 }}>
            <RC.Canvas dpr={1}>
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
              <UI.Heading>Welcome!</UI.Heading>
              <p>
                This is a panel. It displays things. Amazing! Many curious,
                interesting things, that hopefully will make building editor UIs
                really useful. (This is just a slightly longer paragraph to see
                how it renders.)
              </p>
              <p>Like text.</p>
              <p>Or even more text.</p>
            </UI.Panel>

            <UI.Panel>
              <UI.Heading>Buttons</UI.Heading>
              <p>Buttonnnnssss, they're amazing!</p>

              <UI.VerticalGroup>
                <UI.Button>Click me</UI.Button>
                <UI.Button>Or click this one</UI.Button>
                <UI.HorizontalGroup gap>
                  <UI.Button>Left</UI.Button>
                  <UI.Button>Right</UI.Button>
                </UI.HorizontalGroup>
              </UI.VerticalGroup>
            </UI.Panel>

            <UI.Panel>
              <UI.Heading>Inputs</UI.Heading>
              <p>We should try some inputs. Inputs are really cool.</p>

              <UI.Control>
                <UI.Label>Text</UI.Label>
                <UI.Input type="text" spellCheck="false" />
              </UI.Control>

              <UI.Control>
                <UI.Label>Number</UI.Label>
                <UI.Input type="number" />
              </UI.Control>

              <UI.Control>
                <UI.Label>Range</UI.Label>
                <UI.Input type="range" />
              </UI.Control>

              <UI.Control>
                <UI.Label>Vector</UI.Label>

                <UI.HorizontalGroup align={"center"} gap>
                  X
                  <UI.Input type="number" />
                  Y
                  <UI.Input type="number" />
                  Z
                  <UI.Input type="number" />
                </UI.HorizontalGroup>
              </UI.Control>
            </UI.Panel>
          </UI.VerticalGroup>
        </UI.HorizontalGroup>
      </UI.Root>
    </StartScreen>
  )
}
