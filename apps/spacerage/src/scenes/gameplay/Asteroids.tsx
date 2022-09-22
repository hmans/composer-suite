import { useGLTF } from "@react-three/drei"
import { between, plusMinus } from "randomish"
import { Material, Mesh } from "three"
import { Emitter, Particles } from "vfx-composer-r3f"
import { Asteroid } from "./Asteroid"

export const Asteroids = () => {
  const gltf = useGLTF("/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  return (
    <Particles geometry={mesh.geometry} material={mesh.material as Material}>
      <Emitter
        limit={1000}
        rate={Infinity}
        setup={({ position, rotation, scale }) => {
          position.set(plusMinus(100), plusMinus(100), 0)
          rotation.random()
          scale.setScalar(between(0.8, 2))
        }}
      />
    </Particles>
  )
}
