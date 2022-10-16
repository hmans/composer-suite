import { BallCollider, interactionGroups, RigidBody } from "@react-three/rapier"
import { plusMinus } from "randomish"
import { Color, Vector3 } from "three"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { BECS, ECS, Layers, worldBucket } from "./state"

export const Pickups = () => (
  <InstancedParticles>
    <icosahedronGeometry args={[0.5]} />
    <meshStandardMaterial color={new Color("hotpink").multiplyScalar(4)} />

    <BECS.Archetype properties="isPickup">
      {({ entity }) => entity.jsx}
    </BECS.Archetype>
  </InstancedParticles>
)

export type PickupProps = { position: Vector3; onPickup?: () => void }

export const Pickup = ({ onPickup, ...props }: PickupProps) => {
  const [player] = ECS.useArchetype("player")

  return (
    <BECS.Property name="rigidBody">
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
        <BECS.Property name="sceneObject">
          <BallCollider args={[0.5]}>
            <Particle />
          </BallCollider>
        </BECS.Property>
      </RigidBody>
    </BECS.Property>
  )
}

export const spawnPickup = (props: PickupProps) => {
  const entity = worldBucket.add({
    isPickup: true,
    jsx: (
      <Pickup
        {...props}
        onPickup={() => {
          worldBucket.remove(entity)
        }}
      />
    )
  })

  return entity
}
