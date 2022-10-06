import { Color } from "three"
import { InstancedParticles, Particle, ParticleProps } from "vfx-composer-r3f"
import { ECS } from "./state"

export const Pickups = () => (
  <InstancedParticles>
    <icosahedronGeometry args={[0.5]} />
    <meshStandardMaterial color={new Color("hotpink").multiplyScalar(4)} />

    <ECS.ArchetypeEntities archetype="pickup">
      {({ pickup }) => pickup}
    </ECS.ArchetypeEntities>
  </InstancedParticles>
)

export const spawnPickup = (props: ParticleProps) =>
  ECS.world.createEntity({
    pickup: <Particle {...props} />
  })
