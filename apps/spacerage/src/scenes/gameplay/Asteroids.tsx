import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody
} from "@hmans/physics3d"
import { useGLTF } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { startTransition, useLayoutEffect } from "react"
import { Material, Mesh, Quaternion, Vector3 } from "three"
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
  const gltf = useGLTF("/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  const entities = useLotsOfAsteroidsAndAlsoCleanThemUp(initial)

  return (
    <InstancedParticles
      capacity={capacity}
      geometry={mesh.geometry}
      material={mesh.material as Material}
    >
      <ECS.Entities entities={entities}>
        {({ asteroid }) => (
          <ECS.Component name="rigidBody">
            <RigidBody
              position={asteroid?.spawnPosition}
              quaternion={tmpQuaterion.random()}
              scale={asteroid!.scale}
              angularDamping={2}
              linearDamping={0.5}
              enabledTranslations={[true, true, false]}
              enabledRotations={[true, true, true]}
            >
              <group matrixAutoUpdate={false}>
                <ConvexHullCollider
                  density={3}
                  collisionGroups={interactionGroups(Layers.Asteroid, [
                    Layers.Asteroid,
                    Layers.Player
                  ])}
                  points={
                    mesh.geometry.attributes.position.array as Float32Array
                  }
                />
                <Particle />
              </group>
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
        for (const entity of entities) ECS.world.destroyEntity(entity)
      })
    }
  }, [])

  return entities
}
