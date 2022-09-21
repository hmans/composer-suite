import { createStateMachine } from "state-composer"

export const GameState = createStateMachine<"menu" | "gameplay">("menu")
