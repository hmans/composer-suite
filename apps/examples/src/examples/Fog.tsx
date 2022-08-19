import { useTexture } from "@react-three/drei"
import { Layers, useRenderPipeline } from "r3f-stage"
import { between, plusMinus, upTo } from "randomish"
import { useState } from "react"
import { Mul, Rotation3DZ, Time } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { MeshStandardMaterial, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer-r3f"
import { ParticleAttribute } from "vfx-composer/units"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const texture = useTexture(smokeUrl)

  const [{ time, velocity, rotation, scale }] = useState(() => ({
    time: Time(),
    velocity: ParticleAttribute(new Vector3()),
    rotation: ParticleAttribute(0 as number),
    scale: ParticleAttribute(1 as number)
  }))

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group>
      <mesh position-y={2.2}>
        <torusKnotGeometry args={[1.2, 0.5, 100, 100]} />
        <meshStandardMaterial color="gold" metalness={0.1} roughness={0.2} />
      </mesh>

      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />
        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          transparent
          depthWrite={false}
        >
          <VFX.SetAlpha alpha={0.1} />
          <VFX.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
          <VFX.Scale scale={scale} />
          <VFX.Velocity velocity={velocity} time={time} />
          <VFX.Billboard />
          <VFX.SoftParticles softness={2} depthTexture={depth} />
        </VFXMaterial>

        <Emitter
          count={50}
          setup={({ position }) => {
            position.set(plusMinus(3), between(-2, 4), plusMinus(3))
            velocity.value.randomDirection().multiplyScalar(upTo(0.05))
            rotation.value = plusMinus(0.2)
            scale.value = between(1, 10)
          }}
        />
      </Particles>
    </group>
  )
}
