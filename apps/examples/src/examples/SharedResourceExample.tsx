import { ComposableMaterial, Modules } from "material-composer-r3f"
import { between, insideSphere } from "randomish"
import { useMemo } from "react"
import { $, Add, Float, Int, Mul, pipe, Sin, Time, vec3 } from "shader-composer"
import { Vector3 } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"

const tmpVec3 = new Vector3()

const InstanceID = Int($`gl_InstanceID`, { only: "vertex" })

export default function SharedResourceExample() {
  const particles = useParticles()

  const time = useMemo(() => Time(), [])

  const scale = useMemo(
    () =>
      pipe(
        InstanceID,
        (v) => Float($`float(${v})`),
        (v) => Add(Time(), v),
        (v) => Sin(v),
        (v) => Mul(v, 0.2),
        (v) => Add(v, 1)
      ),
    [time]
  )

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

        <ComposableMaterial color="#e63946" metalness={0.5} roughness={0.6}>
          <Modules.Translate offset={offset} />
          <Modules.Scale scale={scale} />
        </ComposableMaterial>

        <Emitter
          position-y={1.5}
          rate={Infinity}
          limit={1000}
          setup={({ position, scale }) => {
            const pos = insideSphere()
            tmpVec3.copy(pos as Vector3)
            position.add(tmpVec3)
            particles.setLifetime(between(1, 3))

            scale.multiplyScalar(between(0.5, 1.5))
          }}
        />
      </Particles>
    </group>
  )
}
