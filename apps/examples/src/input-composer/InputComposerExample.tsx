import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { flow, pipe } from "fp-ts/lib/function"
import { applyDeadzone, clampVector, IVector, magnitude } from "input-composer"
import { useGamepadInput, useKeyboardInput } from "input-composer/react"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useCallback, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

const tmpVec3 = new Vector3()

const onPress = (callback: () => void) => {
  let pressed = false

  return (button: boolean) => {
    if (button && !pressed) {
      pressed = true
      callback()
    } else if (!button) {
      pressed = false
    }

    return button
  }
}

const onActivity = (callback: () => void) => (v: IVector) => {
  if (magnitude(v) > 0) {
    callback()
  }

  return v
}

export default function Example({ playerSpeed = 3 }) {
  const keyboard = useKeyboardInput()
  const gamepad = useGamepadInput(0)
  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)
  const controlScheme = useRef<"keyboard" | "gamepad">("keyboard")

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

  const controller = useMemo(() => {
    /* Define some generic stick vector handling */
    const stickFlow = flow(applyDeadzone(0.1), clampVector())

    /* Define some specific flows for our two input actions */
    const jumpFlow = onPress(doubleJump())
    const moveFlow = stickFlow

    /* Define the functions that will actually get the input states */
    const getKeyboardMoveVector = flow(
      () => keyboard.getVector("w", "s", "a", "d"),
      onActivity(() => (controlScheme.current = "keyboard"))
    )

    const getGamepadMoveVector = flow(
      () => gamepad.getVector(0, 1),
      onActivity(() => {
        console.log("GAMEPAD")
        controlScheme.current = "gamepad"
      })
    )

    const getKeyboardJumpButton = () => !!keyboard.isPressed(" ")
    const getGamepadJumpButton = () => gamepad.getButton(0)

    const getMoveVector = () => getKeyboardMoveVector()
    const getJumpButton = () => !!keyboard.isPressed(" ")

    return () => ({
      move: pipe(getMoveVector(), moveFlow),
      jump: pipe(getJumpButton(), jumpFlow)
    })
  }, [])

  useFrame((_, dt) => {
    const { move, jump } = controller()

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
