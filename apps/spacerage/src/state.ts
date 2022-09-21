import { createStateMachine } from "state-composer"
import { makeStore } from "statery"
import { PerspectiveCamera } from "three"

export const GameState = createStateMachine<"menu" | "gameplay">("menu")

export const startGame = () => GameState.enter("gameplay")

export const store = makeStore({
  camera: null as PerspectiveCamera | null
})
