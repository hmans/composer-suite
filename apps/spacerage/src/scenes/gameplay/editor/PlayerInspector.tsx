import { MiniplexEntityInspector } from "../../../editor/MiniplexInspector"
import { ECS } from "../state"

export const PlayerInspector = () => {
  const [player] = ECS.useArchetype("player")

  return player ? <MiniplexEntityInspector entity={player} /> : null
}
