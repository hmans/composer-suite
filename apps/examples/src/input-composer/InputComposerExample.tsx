import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { flow, pipe } from "fp-ts/lib/function"
import {
  applyDeadzone,
  clampVector,
  InputManager,
  isVector,
  magnitude,
  onPressed
} from "input-composer"
import { useInput } from "input-composer/react"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

const tmpVec3 = new Vector3()

const createController = (input: InputManager) => {
  let scheme = "keyboard" as "keyboard" | "gamepad"

  const withScheme =
    <T extends any>(s: "keyboard" | "gamepad", fun: (t: T) => T) =>
    (v: T) => {
      const value = fun(v)

      if (scheme === s) {
        return value
      } else if (
        (typeof value === "number" && value > 0) ||
        (isVector(value) && magnitude(value) > 0)
      ) {
        console.log("Switching to scheme:", s)
        scheme = s
        return value
      } else {
        return v
      }
    }

  return () => {
    /* Grab the player's gamepad. It may be null if no gamepad is connected. */
    const gamepad = input.gamepad.gamepad(0)

    const jump = pipe(
      0,
      withScheme("keyboard", () => input.keyboard.key(" ")),
      withScheme("gamepad", () => gamepad?.button(0) ?? 0)
    )

    const move = pipe(
      { x: 0, y: 0 },
      withScheme("keyboard", () => ({
        x: input.keyboard.axis("a", "d"),
        y: input.keyboard.axis("s", "w")
      })),
      withScheme("gamepad", () => ({
        x: +(gamepad?.axis(0) ?? 0),
        y: -(gamepad?.axis(1) ?? 0)
      })),
      clampVector(),
      applyDeadzone(0.05)
    )

    return { jump, move }
  }
}

export default function Example({ playerSpeed = 3 }) {
  const input = useInput()
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

  const controller = useMemo(() => createController(input), [input, doubleJump])

  const jumpFlow = useMemo(() => onPressed(doubleJump), [doubleJump])

  useFrame((_, dt) => {
    const { jump, move } = controller()

    pipe(jump, jumpFlow)

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
