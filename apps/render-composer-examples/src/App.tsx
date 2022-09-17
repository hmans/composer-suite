import { Animate } from "@hmans/r3f-animate"
import {
  Environment,
  Loader,
  OrbitControls,
  useTexture
} from "@react-three/drei"
import * as PP from "postprocessing"
import { Suspense, useState } from "react"
import * as RC from "render-composer"
import { bitmask } from "render-composer"
import { Mesh, Object3D } from "three"

const rotate = (o: Object3D, dt: number) => {
  o.rotation.x += dt * 0.7
  o.rotation.y += dt * 0.5
}

function App() {
  const [sun, setSun] = useState<Mesh | null>(null!)

  return (
    <>
      <Loader />

      <RC.Canvas>
        <RC.RenderPipeline>
          <Suspense>
            <PostProcessing sun={sun} />
            <color attach="background" args={["#264653"]} />
            <Environment preset="sunset" />
            <OrbitControls />

            <mesh position={[0, 0, -10]} ref={setSun}>
              <sphereGeometry />
              <meshBasicMaterial color="#f5ebe0" />
            </mesh>

            <directionalLight position={[30, 10, 10]} intensity={1.5} />

            {/* <Sun /> */}

            <Animate
              fun={(o, _, { clock }) => {
                o.position.x = Math.sin(clock.getElapsedTime() * 0.7) * 2
                o.position.y = Math.sin(clock.getElapsedTime() * 1.1)
                o.position.z = Math.cos(clock.getElapsedTime() * 0.5) - 5
              }}
            >
              <Animate fun={rotate}>
                <mesh>
                  <icosahedronGeometry />
                  <meshStandardMaterial
                    color="#E9C46A"
                    metalness={0.5}
                    roughness={0.5}
                  />
                </mesh>
              </Animate>
            </Animate>

            {/* Transparent object */}
            <Animate
              fun={(o, _, { clock }) => {
                o.position.x = -Math.sin(clock.getElapsedTime() * 0.2)
                o.position.y = -Math.sin(clock.getElapsedTime() * 0.2)
                o.position.z = -Math.cos(clock.getElapsedTime() * 0.2)
              }}
            >
              <Animate fun={rotate}>
                <mesh layers-mask={bitmask(RC.Layers.TransparentFX)}>
                  <icosahedronGeometry />
                  <meshStandardMaterial
                    color="#f1faee"
                    transparent
                    opacity={0.2}
                    metalness={0.5}
                    roughness={0.5}
                    depthWrite={false}
                  />
                </mesh>
              </Animate>
            </Animate>
          </Suspense>
        </RC.RenderPipeline>
      </RC.Canvas>
    </>
  )
}

export default App

const PostProcessing = ({ sun }: { sun?: Mesh | null }) => {
  const texture = useTexture("/textures/lensdirt.jpg")

  return (
    <RC.EffectPass>
      <RC.SelectiveBloomEffect />
      <RC.SMAAEffect />
      {sun && <RC.GodRaysEffect lightSource={sun} />}
      <RC.VignetteEffect />
      <RC.NoiseEffect
        premultiply={false}
        blendFunction={PP.BlendFunction.COLOR_DODGE}
        opacity={0.1}
        // blendMode={new PP.BlendMode(PP.BlendFunction.SCREEN, 0.1)}
      />
      <RC.LensDirtEffect texture={texture} />
    </RC.EffectPass>
  )
}
