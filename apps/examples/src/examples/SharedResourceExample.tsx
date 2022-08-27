import { ComposableMaterial, Modules } from "material-composer-r3f"
import { between, insideSphere } from "randomish"
import { Add, Mul, Sin, Time } from "shader-composer"
import { Vector3 } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"

const tmpVec3 = new Vector3()

export default function SharedResourceExample() {
  const particles = useParticles()

  return (
    <group>
      <Particles
        maxParticles={1_000}
        safetyBuffer={2_000}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.08, 3]} />

        <ComposableMaterial color="#e63946" metalness={0.3} roughness={0.5}>
          <Modules.Scale scale={Add(1, Mul(Sin(Time()), 0.2))} />
        </ComposableMaterial>

        <Emitter
          position-y={1.5}
          rate={Infinity}
          limit={500}
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
