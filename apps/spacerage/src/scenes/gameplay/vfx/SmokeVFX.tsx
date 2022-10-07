import { Composable, Modules } from "material-composer-r3f"
import { between, upTo } from "randomish"
import { bitmask, Layers } from "render-composer"
import { Mix, Mul, Smoothstep, Vec3 } from "shader-composer"
import { createParticleLifetime } from "vfx-composer"
import { Emitter, EmitterProps, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { useAsset } from "../assets"
import { ECS } from "../state"

const lifetime = createParticleLifetime()

export const SmokeVFX = () => {
  const rng = InstanceRNG()

  const direction = Vec3([
    Mix(-0.5, 0.5, rng(12)),
    Mix(-0.5, 0.5, rng(17)),
    Mix(-0.5, 0.5, rng(1))
  ])

  const texture = useAsset.textures.smoke()

  return (
    <InstancedParticles
      name="SmokeVFX"
      layers-mask={bitmask(Layers.TransparentFX)}
    >
      <planeGeometry />

      <Composable.MeshStandardMaterial transparent depthWrite={false}>
        <Modules.Billboard />
        <Modules.Scale scale={rng(5)} />
        <Modules.Velocity direction={direction} time={lifetime.age} />
        <Modules.Lifetime {...lifetime} />
        <Modules.Texture texture={texture} />
        <Modules.Alpha
          alpha={(a) => Mul(a, Smoothstep(1, 0.5, lifetime.progress))}
        />
      </Composable.MeshStandardMaterial>

      <ECS.ArchetypeEntities archetype="smoke">
        {({ smoke }) => smoke}
      </ECS.ArchetypeEntities>
    </InstancedParticles>
  )
}

export const spawnSmokeVFX = (props: EmitterProps) =>
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 5,
    smoke: (
      <Emitter
        {...props}
        rate={Infinity}
        limit={between(10, 30)}
        setup={({ mesh }) => {
          lifetime.write(mesh, between(0.5, 2), upTo(0.3))
        }}
      />
    )
  })
