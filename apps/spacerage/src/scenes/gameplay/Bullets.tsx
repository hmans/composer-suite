import { Color } from "three"
import { InstancedParticles } from "vfx-composer-r3f"
import { ECS } from "./state"

export const Bullets = () => {
  return (
    <InstancedParticles>
      <planeGeometry args={[0.1, 0.8]} />
      <meshBasicMaterial color={new Color("yellow").multiplyScalar(2)} />

      <ECS.ManagedEntities tag="isBullet">
        {(entity) => (
          <ECS.Component name="sceneObject">{entity.jsx}</ECS.Component>
        )}
      </ECS.ManagedEntities>
    </InstancedParticles>
  )
}
