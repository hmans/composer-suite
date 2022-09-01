import { makeFSM } from "./lib/makeFSM"
import { initializeGameplay } from "./scenes/Gameplay/state"

type State = "title" | "gameplay"

const { MatchState, enterState, isCurrentState } = makeFSM<State>("title")

export { MatchState }

export const enterGameplay = () => {
  if (!isCurrentState("title")) return
  initializeGameplay()
  enterState("gameplay")
}

export const returnToTitle = () =>
  isCurrentState("gameplay") && enterState("title")
