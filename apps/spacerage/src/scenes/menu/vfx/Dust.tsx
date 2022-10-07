import { composable, modules } from "material-composer-r3f"
import { plusMinus } from "randomish"
import {
  Add,
  Float,
  GlobalTime,
  Input,
  InstanceID,
  Mul,
  ScaleAndOffset,
  Smoothstep,
  Vec3
} from "shader-composer"
import { Random } from "shader-composer-toybox"
import { Color, DoubleSide } from "three"
import { InstanceSetupCallback } from "vfx-composer"
import {
  Emitter,
  InstancedParticles,
  useParticleLifetime
} from "vfx-composer-r3f"
import { useAsset } from "../../gameplay/assets"

/* TODO: extract this into vfx-composer */

export type DustProps = {
  rate?: number
  lifetime?: number
}

export const Dust = ({ lifetime = 60, rate = 50 }: DustProps) => {
  const id = Float(InstanceID, { varying: true })
  const texture = useAsset.textures.particle()

  const getRandom = (offset: Input<"float">) => Random(Add(Mul(id, 50), offset))

  const particles = useParticleLifetime()

  const setup: InstanceSetupCallback = ({
    mesh,
    position,
    rotation,
    scale
  }) => {
    position.set(plusMinus(10), plusMinus(10), plusMinus(10))
    rotation.random()
    particles.write(mesh, lifetime, plusMinus(lifetime))
  }

  return (
    <group>
      <InstancedParticles capacity={2 * rate * lifetime}>
        <planeGeometry args={[0.5, 0.5]} />

        <composable.meshBasicMaterial
          side={DoubleSide}
          map={texture}
          color={new Color("#999")}
          transparent
          depthWrite={false}
        >
          <modules.Billboard />

          <modules.Scale scale={ScaleAndOffset(getRandom(765), 0.03, 0.01)} />
          <modules.Scale scale={Smoothstep(0, 0.05, particles.progress)} />
          <modules.Scale scale={Smoothstep(1, 0.95, particles.progress)} />

          <modules.Velocity
            direction={ScaleAndOffset(
              Vec3([getRandom(1), getRandom(2), getRandom(3)]),
              0.02,
              -0.01
            )}
            time={GlobalTime}
            space="world"
          />
          <modules.Lifetime {...particles} />
        </composable.meshBasicMaterial>

        <Emitter limit={rate * lifetime} rate={Infinity} setup={setup} />
        <Emitter rate={rate} setup={setup} />
      </InstancedParticles>
    </group>
  )
}
