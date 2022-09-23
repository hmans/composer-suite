import { ConvexHullCollider, RigidBody } from "@hmans/physics3d"
import { useGLTF } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { Material, Mesh, Quaternion } from "three"
import { Particle, Particles } from "vfx-composer-r3f"
import { ECS } from "./state"

const tmpQuaterion = new Quaternion()

export const Asteroids = () => {
  const gltf = useGLTF("/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  return (
    <Particles geometry={mesh.geometry} material={mesh.material as Material}>
      <ECS.ManagedEntities initial={200} tag="isAsteroid">
        {() => (
          <ECS.Component name="rigidBody">
            <RigidBody
              position={[plusMinus(100), plusMinus(100), 0]}
              // quaternion={tmpQuaterion.random()}
              // scale={between(0.8, 2)}
              angularDamping={1}
              linearDamping={1}
              enabledTranslations={[true, true, false]}
              enabledRotations={[true, true, true]}
            >
              <ECS.Component name="sceneObject">
                <group>
                  <ConvexHullCollider
                    points={
                      mesh.geometry.attributes.position.array as Float32Array
                    }
                  />
                  <Particle />
                </group>
              </ECS.Component>
            </RigidBody>
          </ECS.Component>
        )}
      </ECS.ManagedEntities>
    </Particles>
  )
}
