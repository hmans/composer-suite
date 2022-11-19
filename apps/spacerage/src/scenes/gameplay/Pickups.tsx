import { BallCollider, interactionGroups, RigidBody } from "@react-three/rapier"
import { useEntities } from "miniplex/react"
import { plusMinus } from "randomish"
import { Color, Vector3 } from "three"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { ECS, Layers } from "./state"

export const Pickups = () => (
  <InstancedParticles>
    <icosahedronGeometry args={[0.5]} />
    <meshStandardMaterial color={new Color("hotpink").multiplyScalar(4)} />

    <ECS.Archetype with="pickup">{(entity) => entity.pickup}</ECS.Archetype>
  </InstancedParticles>
)

export type PickupProps = { position: Vector3; onPickup?: () => void }

export const Pickup = ({ onPickup, ...props }: PickupProps) => {
  const [player] = useEntities(ECS.world.with("player"))

  return (
    <ECS.Component name="rigidBody">
      <RigidBody
        {...props}
        linearVelocity={[plusMinus(4), plusMinus(4), 0]}
        enabledTranslations={[true, true, false]}
        angularDamping={2}
        linearDamping={0.5}
        collisionGroups={interactionGroups(Layers.Pickup, [
          Layers.Pickup,
          Layers.Player
        ])}
        onCollisionEnter={({ collider }) => {
          const rigidBody = collider.parent()
          if (rigidBody && rigidBody === player.rigidBody?.raw()) {
            onPickup?.()
          }
        }}
      >
        <ECS.Component name="sceneObject">
          <BallCollider args={[0.5]}>
            <Particle />
          </BallCollider>
        </ECS.Component>
      </RigidBody>
    </ECS.Component>
  )
}

export const spawnPickup = (props: PickupProps) => {
  const entity = ECS.world.add({
    pickup: (
      <Pickup
        {...props}
        onPickup={() => {
          ECS.world.remove(entity)
        }}
      />
    )
  })

  return entity
}
