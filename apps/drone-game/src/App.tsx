import { RenderCanvas, RenderPipeline } from "render-composer"
import { Environment, OrbitControls } from "@react-three/drei"

export function App() {
  return (
    <RenderCanvas>
      <RenderPipeline bloom antiAliasing vignette>
        <Environment preset="sunset" />
        <mesh>
          <dodecahedronGeometry />
          <meshStandardMaterial
            color="hotpink"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        <OrbitControls />
      </RenderPipeline>
    </RenderCanvas>
  )
}
