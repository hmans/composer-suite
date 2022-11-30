import { Description, FlatStage } from "r3f-stage"
import { ShaderMaterialMaster, VertexPosition } from "shader-composer-r3f"
import { useShader } from "shader-composer-r3f"
import { Billboard } from "shader-composer-toybox"
import { Color } from "three"

export default function BillboardingExample() {
  const shader = useShader(() => {
    return ShaderMaterialMaster({
      position: Billboard(VertexPosition),
      color: new Color("hotpink")
    })
  })

  return (
    <FlatStage>
      {/* Intentionally rotating the mesh to prove that billboarding will negate this transform. */}
      <mesh position={[2, 1.5, 0]} rotation-y={0.5}>
        <planeGeometry />
        <shaderMaterial {...shader} />
      </mesh>

      <Description>
        Use the <strong>Billboard</strong> unit to turn a mesh (like this plane)
        into a billboard that is always facing the camera.
      </Description>
    </FlatStage>
  )
}
