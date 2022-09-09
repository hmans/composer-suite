import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { magnitude } from "input-composer"
import { useInput } from "input-composer/react"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { Group, Vector3 } from "three"

const tmpVec3 = new Vector3()

const useInputScheme = () => {
  const [scheme, setScheme] = useState<"keyboard" | "gamepad">("keyboard")

  useEffect(() => {
    console.log("Switched to scheme:", scheme)
  }, [scheme])

  return [scheme, setScheme]
}

export default function Example({ playerSpeed = 3 }) {
  const input = useInput()
  const [scheme, setScheme] = useInputScheme()

  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  const doubleJump = useCallback(() => {
    let doubleJumped = false

    return () => {
      if (player.current.position.y == 0) {
        doubleJumped = false
        velocity.y = 5
      } else if (!doubleJumped) {
        doubleJumped = true
        velocity.y = 5
      }
    }
  }, [velocity, player])

  useFrame((_, dt) => {
    const keyboardMove = {
      x: input.keyboard.axis("a", "d"),
      y: input.keyboard.axis("s", "w")
    }

    /* Grab the player's gamepad. It may be null if no gamepad is connected. */
    const gamepad = input.gamepad.gamepad(0)

    /* Get the movement vector of the gamepad */
    const gamepadMove = gamepad
      ? {
          x: gamepad.axis(0),
          y: -gamepad.axis(1)
        }
      : { x: 0, y: 0 }

    /* Determine the active control scheme. */
    if (gamepad && magnitude(gamepadMove) > 0) {
      setScheme("gamepad")
    }

    if (magnitude(keyboardMove) > 0) {
      setScheme("keyboard")
    }

    const move = scheme === "gamepad" ? gamepadMove : keyboardMove

    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )
  })

  useFrame((_, dt) => {
    /* Apply velocity */
    player.current.position.add(tmpVec3.copy(velocity).multiplyScalar(dt))

    /* Apply gravity to velocity */
    velocity.y -= 20 * dt

    if (player.current.position.y < 0) {
      velocity.y = 0
      player.current.position.y = 0
    }
  })

  return (
    <FlatStage>
      <Player ref={player} />
      <Description>
        A playground for prototyping <strong>Input Composer</strong>, the
        successor to <strong>Controlfreak</strong>.
      </Description>
    </FlatStage>
  )
}

const Player = forwardRef<Group, GroupProps>((props, ref) => (
  <group ref={ref} {...props}>
    <mesh position-y={0.5} castShadow>
      <capsuleGeometry args={[0.25, 0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </group>
))
