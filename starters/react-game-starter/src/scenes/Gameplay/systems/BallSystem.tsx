import { useFrame } from "@react-three/fiber"
import { AABB, isColliding } from "../../../lib/aabb"
import {
  ballRadius,
  courtHeight,
  courtWidth,
  paddleHeight,
  paddleShake,
  paddleWidth,
  wallShake
} from "../configuration"
import {
  endRound,
  increaseEnemyScore,
  increasePlayerScore,
  randomizeBallRotation,
  useGameplayStore,
  wallHitEffect
} from "../state"
import gsap from "gsap"
import { Color, Mesh, MeshStandardMaterial } from "three"
import { ballImpact } from "../vfx/BallImpact"

export const BallSystem = () => {
  const { ball, ballDirection, ballSpeed, player, enemy, cameraTarget } =
    useGameplayStore()

  useFrame(({ camera }, dt) => {
    if (!ball) return

    /* Move ball */
    {
      ball.position.x += ballDirection.x * ballSpeed * dt
      ball.position.y += ballDirection.y * ballSpeed * dt
    }

    /* Collide with paddles */
    {
      /* Check paddle collisions */
      const ballAABB = AABB(
        ball.position.x - ballRadius / 2,
        ball.position.y - ballRadius / 2,
        ballRadius,
        ballRadius
      )

      const paddles = [player, enemy]
      for (const paddle of paddles) {
        const paddleAABB = AABB(
          paddle.position.x - paddleWidth / 2,
          paddle.position.y - paddleHeight / 2,
          paddleWidth,
          paddleHeight
        )

        if (isColliding(ballAABB, paddleAABB)) {
          /* Move ball outside of paddle */
          if (ballDirection.x < 0) {
            ball.position.x = paddleAABB.x + paddleAABB.width + ballRadius / 2
          } else {
            ball.position.x = paddleAABB.x - ballRadius / 2
          }

          /* Animate the paddle */
          const dy = ball.position.y - paddle.position.y
          gsap.from(paddle.rotation, {
            duration: 0.5,
            z: -Math.sign(ball.position.x) * Math.sign(dy) * 0.1
          })
          gsap.from(paddle.position, {
            duration: 0.3,
            x: paddle.position.x + 0.3 * Math.sign(ball.position.x)
          })
          gsap.from(paddle.scale, {
            duration: 0.3,
            x: 1.4,
            y: 1.4,
            z: 1.4
          })

          /* Shake camera */
          cameraTarget.position.x += ballDirection.x * paddleShake
          cameraTarget.position.y -= ballDirection.y * paddleShake

          /* Bounce the ball */
          ballDirection.x = -ballDirection.x

          randomizeBallRotation()
        }
      }
    }

    {
      const verticalRange = courtHeight / 2 - ballRadius
      const horizontalRange = courtWidth / 2 - ballRadius

      /* Collision with upper or lower bounds - just bounce off the wall */
      if (ball.position.y < -verticalRange) {
        ballDirection.y *= -1
        ball.position.y = -verticalRange
        cameraTarget.position.y -= wallShake
        wallHitEffect("lower")
        ballImpact(ball.position)
      } else if (ball.position.y > verticalRange) {
        ballDirection.y *= -1
        ball.position.y = verticalRange
        cameraTarget.position.y += wallShake
        wallHitEffect("upper")
        ballImpact(ball.position)
      }

      /* Horizontal collision with wall -- score! */
      if (ball.position.x < -horizontalRange) {
        cameraTarget.position.x -= wallShake
        wallHitEffect("left")
        ballImpact(ball.position)
        increaseEnemyScore()
        endRound()
      } else if (ball.position.x > horizontalRange) {
        cameraTarget.position.x += wallShake
        wallHitEffect("right")
        ballImpact(ball.position)
        increasePlayerScore()
        endRound()
      }
    }
  })

  return null
}
