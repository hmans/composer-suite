import { useTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import { useMemo, useState } from "react"
import { Mul, Rotation3DZ, Time, Uniform } from "shader-composer"
import { MeshStandardMaterial, PerspectiveCamera, Vector3 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"
import { SoftParticles, RenderContext } from "./lib/softies"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const texture = useTexture(smokeUrl)
  const { depthTexture } = useDepthBuffer()

  /* TODO: extract this into sc-r3f? */
  const { scene, camera } = useThree()
  const renderContext = useMemo(() => RenderContext(scene, camera), [
    scene,
    camera
  ])

  const [{ time, velocity, rotation, scale }] = useState(() => ({
    time: Time(),
    velocity: ParticleAttribute(new Vector3()),
    rotation: ParticleAttribute(0 as number),
    scale: ParticleAttribute(1 as number)
  }))

  const depthSampler2D = useMemo(() => Uniform("sampler2D", depthTexture), [
    depthTexture
  ])

  return (
    <group>
      <mesh position-y={13}>
        <torusKnotGeometry args={[7, 2.5, 100]} />
        <meshStandardMaterial color="gold" metalness={0.1} roughness={0.2} />
      </mesh>

      <Particles>
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
          <VFX.Module
            module={SoftParticles({
              softness: 10,
              depthSampler2D,
              renderContext
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
