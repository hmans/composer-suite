import { MiniplexEntityInspector } from "../../../editor/MiniplexInspector"
import { ECS } from "../state"
import { archetype } from "miniplex"

export const PlayerInspector = () => {
  const [player] = ECS.useEntities(archetype("player"))

  return player ? <MiniplexEntityInspector entity={player} /> : null
}
