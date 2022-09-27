import { RegisteredEntity } from "miniplex"
import { ECS, Entity } from "../scenes/gameplay/state"

export const JSXEntities = ({
  entities
}: {
  entities: RegisteredEntity<Entity>[]
}) => (
  <ECS.Entities entities={entities}>
    {(entity) => <>{entity.jsx}</>}
  </ECS.Entities>
)
