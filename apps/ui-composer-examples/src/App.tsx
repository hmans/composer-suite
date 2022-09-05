import { Animate, useAnimationFrame } from "@hmans/things"
import { Environment, OrbitControls, Sky } from "@react-three/drei"
import {
  HTMLProps,
  MutableRefObject,
  PropsWithChildren,
  PropsWithoutRef,
  useRef,
  useState
} from "react"
import { RenderCanvas, RenderPipeline } from "render-composer"
import { Group, Mesh, Object3D, Vector3 } from "three"
import * as UI from "ui-composer"

/* TODO: Extract this into hmans/things or similar */

export function useAnimationFrameEffect<T>(
  dependencyCallback: () => T,
  callback: (args: T) => void
) {
  const value = useRef<T>(null!)

  useAnimationFrame(() => {
    const newValue = dependencyCallback()

    if (value.current !== newValue) {
      value.current = newValue
      callback(newValue)
    }
  })
}

const BoundInput = ({
  getter,
  value: initialValue,
  ...props
}: Parameters<typeof UI.Input>[0] & { getter: () => number }) => {
  const [value, setValue] = useState(0)

  useAnimationFrameEffect(getter, setValue)

  return (
    <UI.Input
      {...props}
      onChange={(e) => setValue(Number(e.target.value))}
      value={value.toFixed(2)}
    ></UI.Input>
  )
}

const VectorInputs = ({
  vector
}: {
  vector: { x: number; y: number; z: number }
}) => {
  return (
    <UI.HorizontalGroup align="center" gap>
      X
      <BoundInput type="number" getter={() => vector.x} />
      Y
      <BoundInput type="number" getter={() => vector.y} />
      Z
      <BoundInput type="number" getter={() => vector.z} />
    </UI.HorizontalGroup>
  )
}

const MeshPanel = ({ sceneObject }: { sceneObject: Object3D }) => {
  return (
    <UI.Panel>
      <UI.Heading>Mesh Playground</UI.Heading>
      <p>Just playing around with some two-way binding stuff.</p>

      <UI.Control>
        <UI.Label>Rotation</UI.Label>
        <VectorInputs vector={sceneObject.rotation} />
      </UI.Control>
    </UI.Panel>
  )
}

/* TODO: extract into @hmans/things? */
const useRefState = <T extends any>(
  initialState: T | null | (() => T | null) = null
) => useState<T | null>(initialState)

const App = () => {
  const [sceneObject, setSceneObject] = useRefState<Object3D>()

  return (
    <UI.Root>
      <UI.HorizontalGroup>
        <div style={{ flex: 2 }}>
          <RenderCanvas>
            <RenderPipeline bloom antiAliasing vignette>
              <Environment preset="sunset" />
              <Sky />
              <OrbitControls />

              <Animate
                ref={setSceneObject}
                fun={(mesh, dt) =>
                  (mesh.rotation.x = mesh.rotation.y += 2 * dt)
                }
              >
                <mesh>
                  <dodecahedronGeometry />
                  <meshStandardMaterial color="hotpink" />
                </mesh>
              </Animate>
            </RenderPipeline>
          </RenderCanvas>
        </div>

        <UI.HorizontalResizer />

        <UI.VerticalGroup css={{ flex: 1 }}>
          {sceneObject && <MeshPanel sceneObject={sceneObject} />}
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
              <UI.Label>Boolean</UI.Label>
              <UI.BooleanControl description="This is a test. Yo." />
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
  )
}

export default App
