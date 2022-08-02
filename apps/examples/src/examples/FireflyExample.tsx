import { useFrame } from "@react-three/fiber"
import { upTo } from "randomish"
import { useRef, useState } from "react"
import { OneMinus, Time } from "shader-composer"
import {
  Color,
  Mesh,
  MeshStandardMaterial,
  NormalBlending,
  Vector2,
  Vector3
} from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const tmpVec3 = new Vector3()

export const FireflyExample = () => {
  const mesh = useRef<Mesh>(null!)

  const [variables] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3())
  }))

  const { ParticleProgress, ParticleAge, module: lifetimeModule } = Lifetime(
    variables.lifetime,
    variables.time
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    mesh.current.position.set(
      Math.sin(t * 5) * Math.cos(t) * 5,
      10 + Math.cos(t * 3) * Math.sin(t) * 8,
      Math.sin(t * 1) * Math.cos(t * 0.5) * 3
    )
  })

  return (
    <Particles>
      <planeGeometry args={[0.2, 0.2]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color={new Color(2, 1, 2)}
        blending={NormalBlending}
        transparent
      >
        <VFX.Billboard />
        <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
        <VFX.Acceleration force={new Vector3(0, -10, 0)} time={ParticleAge} />
        <VFX.SetAlpha alpha={OneMinus(ParticleProgress)} />
        <VFX.Module module={lifetimeModule} />
      </VFXMaterial>

      <mesh ref={mesh}>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="hotpink" />

        <Emitter
          continuous
          count={10}
          setup={({ position }) => {
            position.add(tmpVec3.randomDirection().multiplyScalar(upTo(0.8)))

            const t = variables.time.uniform.value
            variables.lifetime.value.set(t, t + 1)
            variables.velocity.value.randomDirection().multiplyScalar(upTo(5))
          }}
        />
      </mesh>
    </Particles>
  )
}
