import { composable, modules } from "material-composer-r3f"
import { between, insideSphere } from "randomish"
import { useMemo } from "react"
import {
  $,
  Add,
  Float,
  Input,
  Int,
  Mul,
  pipe,
  Sin,
  Time,
  vec2,
  vec3
} from "shader-composer"
import { Vector3 } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"
import { PSRDNoise2D } from "shader-composer-toybox"
const tmpVec3 = new Vector3()

export const float = (v: Input<"float" | "bool" | "int">) =>
  Float($`float(${v})`)

const InstanceID = Int($`gl_InstanceID`, { only: "vertex" })

export default function SharedResourceExample() {
  const particles = useParticles()

  const time = useMemo(() => Time(), [])

  const offset = vec3(1, 0, 0)

  return (
    <group>
      <Particles
        maxParticles={1_000}
        safetyBuffer={2_000}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.08, 16, 16]} />

        <composable.MeshStandardMaterial
          color="#e63946"
          metalness={0.5}
          roughness={0.6}
          autoShadow
        >
          <modules.Translate offset={vec3(1, 0, 0)} />
          <modules.Scale
            scale={pipe(
              float(InstanceID),
              (v) => Add(Time(), v),
              (v) => Sin(v),
              (v) => Mul(v, 0.2),
              (v) => Add(v, 1)
            )}
          />
        </composable.MeshStandardMaterial>

        <Emitter
          position-y={1.5}
          rate={Infinity}
          limit={1000}
          setup={({ position, scale }) => {
            position.add(insideSphere() as Vector3)
            scale.multiplyScalar(between(0.5, 1.5))
          }}
        />
      </Particles>
    </group>
  )
}
