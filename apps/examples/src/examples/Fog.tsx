import { useTexture } from "@react-three/drei"
import { MeshStandardMaterial } from "three"
import { Emitter, Particles, VFXMaterial } from "vfx-composer/fiber"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture
  const texture = useTexture(smokeUrl)

  return (
    <Particles position-y={9}>
      <planeGeometry />
      <VFXMaterial baseMaterial={MeshStandardMaterial}></VFXMaterial>

      <Emitter />
    </Particles>
  )
}
