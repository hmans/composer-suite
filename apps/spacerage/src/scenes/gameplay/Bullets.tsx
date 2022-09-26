import { ECS } from "./state"

export const Bullets = () => {
  return (
    <ECS.ManagedEntities tag="isBullet">
      {(entity) => (
        <ECS.Component name="sceneObject">{entity.jsx!}</ECS.Component>
      )}
    </ECS.ManagedEntities>
  )
}
