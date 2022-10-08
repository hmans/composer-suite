import { courtWidth, paddleWidth, playerColor } from "../configuration"
import { setGameObject } from "../state"
import { Paddle } from "./Paddle"

export const Player = () => (
  <group
    ref={setGameObject("player")}
    position-x={-(courtWidth / 2 - paddleWidth - 0.5)}
  >
    <Paddle color={playerColor} />
  </group>
)
