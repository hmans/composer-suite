import { useLoader } from "@react-three/fiber"
import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody
} from "@react-three/rapier"
import { useEntities } from "miniplex/react"
import { between, plusMinus } from "randomish"
import { startTransition, useLayoutEffect } from "react"
import { Material, Mesh, Quaternion, Vector3 } from "three"
import { GLTFLoader } from "three-stdlib"
import { InstancedParticles, Particle } from "vfx-composer-r3f"
import { ECS, Layers } from "./state"
import { spawnSmokeVFX } from "./vfx/SmokeVFX"

const tmpQuaterion = new Quaternion()
const tmpVec3 = new Vector3()

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
      <ECS.Entities in={entities}>
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
                  Layers.Player,
                  Layers.Bullet
                ])}
                args={[mesh.geometry.attributes.position.array as Float32Array]}
                onCollisionEnter={(e) => {
                  const position = tmpVec3
                    .copy(e.manifold.localContactPoint1(0) as Vector3)
                    .applyQuaternion(e.collider.rotation() as Quaternion)
                    .add(e.collider.translation() as Vector3)

                  spawnSmokeVFX({ position })
                }}
              />
              <ECS.Component name="sceneObject">
                <Particle matrixAutoUpdate={false} />
              </ECS.Component>
            </RigidBody>
          </ECS.Component>
        )}
      </ECS.Entities>
    </InstancedParticles>
  )
}

export const spawnAsteroid = (position: Vector3, scale: number = 1) => {
  ECS.world.add({
    asteroid: {
      spawnPosition: position,
      scale
    },
    health: 250 * scale
  })
}

const useLotsOfAsteroidsAndAlsoCleanThemUp = (count: number) => {
  const entities = useEntities(ECS.world.with("asteroid"))

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
        for (const entity of entities) ECS.world.remove(entity)
      })
    }
  }, [])

  return entities
}
