import { useGLTF } from "@react-three/drei"
import { insideSphere, power } from "randomish"
import { Material, Mesh, Vector3 } from "three"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"

export const AsteroidField = () => {
  const gltf = useGLTF("/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  return (
    <group>
      <InstancedParticles
        geometry={mesh.geometry}
        material={mesh.material as Material}
        capacity={30000}
      >
        <Emitter
          limit={30000}
          rate={Infinity}
          setup={({ position, rotation, scale }) => {
            const pos = insideSphere(1000)
            position.copy(pos as Vector3)
            scale.setScalar(0.5 + power(5) * 10)
            rotation.random()
          }}
        />
      </InstancedParticles>
    </group>
  )
}
