import { between, plusMinus } from "randomish"
import { Material, Mesh } from "three"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"
import { useAsset } from "../assets"

export const BackgroundAsteroids = ({
  amount = 10_000
}: {
  amount?: number
}) => {
  const gltf = useAsset.asteroid()
  const mesh = gltf.scene.children[0] as Mesh

  const setup: InstanceSetupCallback = ({ position, rotation, scale }) => {
    position.set(plusMinus(1000), plusMinus(1000), between(-30, -500))
    rotation.random()
    scale.setScalar(between(0.5, 4))
  }

  return (
    <InstancedParticles
      geometry={mesh.geometry.clone()}
      material={mesh.material as Material}
      capacity={amount}
    >
      <Emitter limit={amount} rate={Infinity} setup={setup} />
    </InstancedParticles>
  )
}
