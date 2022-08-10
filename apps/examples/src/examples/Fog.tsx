import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { useState } from "react"
import { Mul, Rotation3DZ, Time, UniformUnit } from "shader-composer"
import { SceneDepthTexture } from "shader-composer-toybox"
import { MeshStandardMaterial, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"
import { Layers } from "./Layers"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const texture = useTexture(smokeUrl)

  const [{ time, velocity, rotation, scale }] = useState(() => ({
    time: Time(),
    velocity: ParticleAttribute(new Vector3()),
    rotation: ParticleAttribute(0 as number),
    scale: ParticleAttribute(1 as number)
  }))

  return (
    <group>
      <mesh position-y={13}>
        <torusKnotGeometry args={[7, 2.5, 100]} />
        <meshStandardMaterial color="gold" metalness={0.1} roughness={0.2} />
      </mesh>

      <Particles layers={Layers.TransparentFX}>
        <planeGeometry />
        <VFXMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          transparent
          depthWrite={false}
        >
          <VFX.SetAlpha alpha={0.15} />
          <VFX.Velocity velocity={velocity} time={time} />
          <VFX.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
          <VFX.Scale scale={scale} />
          <VFX.Billboard />
          <VFX.SoftParticles
            softness={10}
            depthTexture={SceneDepthTexture({
              resolution: 0.5,
              layer: Layers.TransparentFX
            })}
          />
        </VFXMaterial>

        <Emitter
          count={50}
          setup={({ position }) => {
            position.set(plusMinus(10), between(-4, 17), plusMinus(10))
            velocity.value.randomDirection().multiplyScalar(upTo(0.002))
            rotation.value = plusMinus(0.1)
            scale.value = between(10, 50)
          }}
        />
      </Particles>
    </group>
  )
}
