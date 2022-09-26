import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody
} from "@hmans/physics3d"
import { useGLTF } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { useLayoutEffect, useTransition } from "react"
import { Material, Mesh, Quaternion, Vector3 } from "three"
import { Particle, Particles } from "vfx-composer-r3f"
import { ECS, Layers, spawnAsteroid } from "./state"

const tmpQuaterion = new Quaternion()

export const Asteroids = () => {
  const gltf = useGLTF("/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  const { entities } = ECS.useArchetype("asteroid")

  useLayoutEffect(() => {
    /* Spawn a bunch of asteroids */
    for (let i = 0; i < 1000; i++) {
      spawnAsteroid(
        new Vector3(plusMinus(300), plusMinus(300), 0),
        between(0.8, 2)
      )
    }
  }, [])

  return (
    <Particles
      capacity={10000}
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
              angularDamping={1}
              linearDamping={0.5}
              enabledTranslations={[true, true, false]}
              enabledRotations={[true, true, true]}
            >
              <group>
                <ConvexHullCollider
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
    </Particles>
  )
}
