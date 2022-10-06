import {
  BallCollider,
  interactionGroups,
  RigidBody,
  RigidBodyProps
} from "@react-three/rapier"
import { Color, Vector3 } from "three"
import { InstancedParticles, Particle, ParticleProps } from "vfx-composer-r3f"
import { ECS, Layers } from "./state"

export const Pickups = () => (
  <InstancedParticles>
    <icosahedronGeometry args={[0.5]} />
    <meshStandardMaterial color={new Color("hotpink").multiplyScalar(4)} />

    <ECS.ArchetypeEntities archetype="pickup">
      {({ pickup }) => pickup}
    </ECS.ArchetypeEntities>
  </InstancedParticles>
)

export type PickupProps = { position: Vector3 }

export const Pickup = (props: PickupProps) => (
  <ECS.Component name="rigidBody">
    <RigidBody
      {...props}
      enabledTranslations={[true, true, false]}
      angularDamping={2}
      linearDamping={0.5}
      collisionGroups={interactionGroups(Layers.Pickup, [
        Layers.Pickup,
        Layers.Player
      ])}
    >
      <ECS.Component name="sceneObject">
        <BallCollider args={[0.5]}>
          <Particle />
        </BallCollider>
      </ECS.Component>
    </RigidBody>
  </ECS.Component>
)

export const spawnPickup = (props: PickupProps) =>
  ECS.world.createEntity({
    pickup: <Pickup {...props} />
  })
