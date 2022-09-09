import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { magnitude, onPressed } from "input-composer"
import { useInput } from "input-composer/react"
import { Description, FlatStage } from "r3f-stage"
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { Group, Vector3 } from "three"

const tmpVec3 = new Vector3()

/* An example implementation of a piece of state tracking the current input scheme. */
const useInputScheme = () => {
  const [scheme, setScheme] = useState<"keyboard" | "gamepad">("keyboard")

  useEffect(() => {
    console.log("Switched to scheme:", scheme)
  }, [scheme])

  return [scheme, setScheme] as const
}

export default function Example({ playerSpeed = 3 }) {
  const input = useInput()
  const [scheme, setScheme] = useInputScheme()

  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  /* A callback that will make the player jump when the player is on the ground,
  and double-jump once while they are in the air. */
  const doubleJump = useMemo(() => {
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

  const controller = useMemo(() => {
    return () => {
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

      const keyboardJump = input.keyboard.key(" ")
      const gamepadJump = gamepad ? gamepad.button(0) : 0

      /* Determine the active control scheme. */
      if (gamepad && magnitude(gamepadMove) > 0) {
        setScheme("gamepad")
      }

      if (magnitude(keyboardMove) > 0) {
        setScheme("keyboard")
      }

      const move = scheme === "gamepad" ? gamepadMove : keyboardMove

      const jump = scheme === "gamepad" ? gamepadJump : keyboardJump

      pipe(jump, jumpFlow)

      return { jump, move }
    }
  }, [input, scheme])

  const jumpFlow = onPressed(doubleJump)

  useFrame((_, dt) => {
    const { jump, move } = controller()

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
