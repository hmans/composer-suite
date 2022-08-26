import { useFrame } from "@react-three/fiber"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { chance, upTo } from "randomish"
import { useRef } from "react"
import { OneMinus } from "shader-composer"
import {
  Color,
  Mesh,
  MeshStandardMaterial,
  NormalBlending,
  Vector3
} from "three"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles
} from "vfx-composer-r3f"

const tmpVec3 = new Vector3()

export const FireflyExample = () => {
  const mesh = useRef<Mesh>(null!)

  const particles = useParticles()
  const velocity = useParticleAttribute(() => new Vector3())
  const color = useParticleAttribute(() => new Color())

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

      <ComposableMaterial
        baseMaterial={MeshStandardMaterial}
        color={new Color(4, 1, 4)}
        blending={NormalBlending}
        transparent
      >
        <Modules.Billboard />
        <Modules.Velocity velocity={velocity} time={particles.age} />
        <Modules.Acceleration
          force={new Vector3(0, -10, 0)}
          time={particles.age}
        />
        <Modules.Alpha alpha={OneMinus(particles.progress)} />
        <Modules.Color color={color} />
        <Modules.Lifetime {...particles} />
      </ComposableMaterial>

      <mesh ref={mesh}>
        <dodecahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="hotpink" />

        <Emitter
          continuous
          count={10}
          setup={({ position, rotation }) => {
            /*
            The position automatically inherits the emitter's position, but let's
            add a little random offset to spice things up!
            */
            position.add(tmpVec3.randomDirection().multiplyScalar(upTo(0.4)))

            chance(0.5)
              ? color.value.setRGB(3, 1, 3)
              : color.value.setRGB(1, 3, 3)

            particles.setLifetime(1)
            velocity.value.randomDirection().multiplyScalar(upTo(2))
          }}
        />
      </mesh>
    </Particles>
  )
}
