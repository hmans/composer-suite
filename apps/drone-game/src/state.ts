import { createStateMachine } from "state-composer"

export const FSM = createStateMachine("gameplay" as "gameplay" | "gameover")

export const enterGameplay = () => FSM.enter("gameplay")
