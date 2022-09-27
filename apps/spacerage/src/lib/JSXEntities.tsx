import { ComponentName, Query } from "miniplex"
import { ECS, Entity } from "../scenes/gameplay/state"

export const JSXEntities = ({
  archetype
}: {
  archetype: ComponentName<Entity>[]
}) => {
  const { entities } = ECS.useArchetype(...archetype)

  return (
    <ECS.Entities entities={entities}>
      {(entity) => <>{entity.jsx}</>}
    </ECS.Entities>
  )
}
