import { courtWidth, enemyColor, paddleWidth } from "../configuration"
import { setGameObject } from "../state"
import { Paddle } from "./Paddle"

export const Enemy = () => (
  <group
    ref={setGameObject("enemy")}
    position-x={+(courtWidth / 2 - paddleWidth - 0.5)}
  >
    <Paddle color={enemyColor} />
  </group>
)
