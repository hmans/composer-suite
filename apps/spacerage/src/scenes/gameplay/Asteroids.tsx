import { useLoader } from "@react-three/fiber"
import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody
} from "@react-three/rapier"
import { between, plusMinus } from "randomish"
import { startTransition, useLayoutEffect } from "react"
import { Material, Mesh, Quaternion, Vector3 } from "three"
import { GLTFLoader } from "three-stdlib"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { ECS, Layers } from "./state"

const tmpQuaterion = new Quaternion()

export const Asteroids = ({
  initial,
  capacity = initial * 10
}: {
  initial: number
  capacity?: number
}) => {
  const gltf = useLoader(GLTFLoader, "/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  const entities = useLotsOfAsteroidsAndAlsoCleanThemUp(initial)

  return (
    <InstancedParticles
      capacity={capacity}
      geometry={mesh.geometry.clone()}
      material={(mesh.material as Material).clone()}
    >
      <ECS.Entities entities={entities}>
        {({ asteroid }) => (
          <ECS.Component name="rigidBody">
            <RigidBody
              position={asteroid.spawnPosition}
              scale={asteroid.scale}
              quaternion={tmpQuaterion.random()}
              angularDamping={2}
              linearDamping={0.5}
              enabledTranslations={[true, true, false]}
              enabledRotations={[true, true, true]}
            >
              <ConvexHullCollider
                density={3}
                collisionGroups={interactionGroups(Layers.Asteroid, [
                  Layers.Asteroid,
                  Layers.Player
                ])}
                args={[mesh.geometry.attributes.position.array as Float32Array]}
              />
              <Particle />
            </RigidBody>
          </ECS.Component>
        )}
      </ECS.Entities>
    </InstancedParticles>
  )
}

export const spawnAsteroid = (position: Vector3, scale: number = 1) => {
  ECS.world.createEntity({
    asteroid: {
      spawnPosition: position,
      scale
    },
    health: 100 * scale
  })
}

const useLotsOfAsteroidsAndAlsoCleanThemUp = (count: number) => {
  const { entities } = ECS.useArchetype("asteroid")

  useLayoutEffect(() => {
    /* Spawn a bunch of asteroids */
    startTransition(() => {
      for (let i = 0; i < count; i++) {
        spawnAsteroid(
          new Vector3(plusMinus(100), plusMinus(100), 0),
          between(0.8, 2)
        )
      }
    })

    return () => {
      /* Destroy all asteroids */
      startTransition(() => {
        for (let i = entities.length; i > 0; i--)
          ECS.world.destroyEntity(entities[i - 1])
      })
    }
  }, [])

  return entities
}
