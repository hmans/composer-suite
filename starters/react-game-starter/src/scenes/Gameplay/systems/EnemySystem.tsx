import { useFrame } from "@react-three/fiber"
import { between, chance } from "randomish"
import { paddleSpeed } from "../configuration"
import { store, useGameplayStore } from "../state"

export const EnemySystem = () => {
  const { enemy, enemySlack, ball } = useGameplayStore()

  useFrame((_, dt) => {
    if (!enemy || !ball) return

    /* Determine a target height */
    const targetHeight = ball.position.y

    if (enemy.position.y > targetHeight + enemySlack) {
      enemy.position.y -= dt * paddleSpeed
    } else if (enemy.position.y < targetHeight - enemySlack) {
      enemy.position.y += dt * paddleSpeed
    }

    /* Randomly change slack */
    if (chance(0.01)) {
      store.set({ enemySlack: between(1, 5) })
    }
  })

  return null
}
