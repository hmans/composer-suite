import { useTexture } from "@react-three/drei"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { useRenderPipeline } from "r3f-stage"
import { between, plusMinus } from "randomish"
import { OneMinus } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { AdditiveBlending, Color, DoubleSide, Euler, Vector3 } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"
import { particleUrl } from "./textures"

export default function MagicWellExample() {
  const texture = useTexture(particleUrl)
  const particles = useParticles()
  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group>
      <Particles maxParticles={5_000}>
        <planeGeometry args={[0.15, 2]} />

        <ComposableMaterial
          map={texture}
          depthWrite={false}
          blending={AdditiveBlending}
          side={DoubleSide}
          color={new Color(0, 3, 2)}
        >
          <Modules.Scale scale={OneMinus(particles.progress)} />
          <Modules.Acceleration
            force={new Vector3(0, 1.2, 0)}
            time={particles.age}
          />
          <Modules.Lifetime {...particles} />
          <Modules.Softness softness={5} depthTexture={depth} />
        </ComposableMaterial>

        <Emitter
          rate={250}
          setup={({ position, rotation }) => {
            const theta = plusMinus(Math.PI)
            const power = Math.pow(Math.random(), 3)
            const r = power * 1.2
            position.set(Math.cos(theta) * r, -1, Math.sin(theta) * r)

            rotation.setFromEuler(new Euler(0, plusMinus(Math.PI), 0))

            particles.setLifetime(between(1, 5))
          }}
        />
      </Particles>
    </group>
  )
}
