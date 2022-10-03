import { createStateMachine } from "state-composer"
import { makeStore } from "statery"
import { PerspectiveCamera } from "three"
import tunnel from "tunnel-rat"

export const GameState = createStateMachine<"menu" | "gameplay">("menu")

export const startGame = () => GameState.enter("gameplay")

export const store = makeStore({
  camera: null as PerspectiveCamera | null
})

export const SidebarTunnel = tunnel()
