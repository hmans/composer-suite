import { useFrame } from "@react-three/fiber"
import { chance, upTo } from "randomish"
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
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer-r3f"
import { Lifetime } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const tmpVec3 = new Vector3()

export const FireflyExample = () => {
  const mesh = useRef<Mesh>(null!)

  const [variables] = useState(() => ({
    time: Time(),
    color: ParticleAttribute(new Color()),
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
      Math.sin(t * 5) * Math.cos(t) * 1.5,
      3 + Math.cos(t * 3) * Math.sin(t),
      Math.sin(t * 3.3) * 1.5
    )
  })

  return (
    <Particles>
      <planeGeometry args={[0.05, 0.05]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color={new Color(4, 1, 4)}
        blending={NormalBlending}
        transparent
      >
        <VFX.Billboard />
        <VFX.Velocity velocity={variables.velocity} time={ParticleAge} />
        <VFX.Acceleration force={new Vector3(0, -10, 0)} time={ParticleAge} />
        <VFX.SetAlpha alpha={OneMinus(ParticleProgress)} />
        <VFX.SetColor color={variables.color} />
        <VFX.Module module={lifetimeModule} />
      </VFXMaterial>

      <mesh ref={mesh}>
        <dodecahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="hotpink" />

        <Emitter
          continuous
          count={10}
          setup={({ position }) => {
            /*
            The position automatically inherits the emitter's position, but let's
            add a little random offset to spice things up!
            */
            position.add(tmpVec3.randomDirection().multiplyScalar(upTo(0.4)))

            chance(0.5)
              ? variables.color.value.setRGB(3, 1, 3)
              : variables.color.value.setRGB(1, 3, 3)

            const t = variables.time.value
            variables.lifetime.value.set(t, t + 1)
            variables.velocity.value.randomDirection().multiplyScalar(upTo(2))
          }}
        />
      </mesh>
    </Particles>
  )
}
