import { useFrame } from "@react-three/fiber"
import { composable, modules } from "material-composer-r3f"
import { FlatStage } from "r3f-stage"
import { chance, upTo } from "randomish"
import { useRef } from "react"
import { OneMinus } from "shader-composer-three"
import { Color, Mesh, NormalBlending, Vector3 } from "three"
import {
  Emitter,
  InstancedParticles,
  useParticleAttribute,
  useParticleLifetime
} from "vfx-composer-r3f"

const tmpVec3 = new Vector3()

export const FireflyExample = () => {
  const mesh = useRef<Mesh>(null!)

  const lifetime = useParticleLifetime()
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
    <FlatStage>
      <InstancedParticles>
        <planeGeometry args={[0.05, 0.05]} />

        <composable.meshStandardMaterial
          color={new Color(4, 1, 4)}
          blending={NormalBlending}
          transparent
        >
          <modules.Billboard />
          <modules.Velocity direction={velocity} time={lifetime.age} />
          <modules.Acceleration
            direction={new Vector3(0, -10, 0)}
            time={lifetime.age}
          />
          <modules.Alpha alpha={OneMinus(lifetime.progress)} />
          <modules.Color color={color} />
          <modules.Lifetime {...lifetime} />
        </composable.meshStandardMaterial>

        <mesh ref={mesh} castShadow>
          <dodecahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="hotpink" />

          <Emitter
            rate={700}
            setup={({ mesh, position }) => {
              /*
              The position automatically inherits the emitter's position, but let's
              add a little random offset to spice things up!
              */
              position.add(tmpVec3.randomDirection().multiplyScalar(upTo(0.4)))

              color.write(mesh, (v) =>
                chance(0.5) ? v.setRGB(3, 1, 3) : v.setRGB(1, 3, 3)
              )
              lifetime.write(mesh, 1)
              velocity.write(mesh, (v) =>
                v.randomDirection().multiplyScalar(upTo(2))
              )
            }}
          />
        </mesh>
      </InstancedParticles>
    </FlatStage>
  )
}
