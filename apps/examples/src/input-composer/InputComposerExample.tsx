import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe, flow } from "fp-ts/lib/function"
import { applyDeadzone, clampVector, IVector, magnitude } from "input-composer"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useEffect, useRef, useState } from "react"
import { Group, Vector3 } from "three"
import { useGamepadInput, useKeyboardInput } from "input-composer/react"

const tmpVec3 = new Vector3()

type ControllerProps = {
  gamepad: number
  up: string
  down: string
  left: string
  right: string
  onJump: () => void
}

const copyVector = (source: IVector) => (v: IVector) => {
  v.x = source.x
  v.y = source.y
  return v
}

const onPressedDown = (callback: () => void) => {
  let pushed = false

  return (button: boolean) => {
    if (button && !pushed) {
      pushed = true
      callback()
    } else if (!button) {
      pushed = false
    }

    return button
  }
}

const useInputController = (props: ControllerProps) => {
  const keyboard = useKeyboardInput()
  const gamepad = useGamepadInput(props.gamepad)

  const [activeDevice, setActiveDevice] = useState<"keyboard" | "gamepad">(
    "keyboard"
  )

  const getKeyboardVector = () =>
    keyboard.getVector(props.up, props.down, props.left, props.right)

  const getGamepadVector = () => gamepad.getVector(0, 1)

  const controls = {
    move: { x: 0, y: 0 },
    fire: false
  }

  const autoSwitchInputScheme = <T extends any>(payload: T) => {
    const keyboardVector = getKeyboardVector()
    const gamepadVector = getGamepadVector()

    if (magnitude(keyboardVector)) {
      setActiveDevice("keyboard")
    }

    if (magnitude(gamepadVector) > 0) {
      setActiveDevice("gamepad")
    }

    return payload
  }

  const jumpFlow = flow(
    (v) => !!gamepad.getButton(0),
    onPressedDown(props.onJump)
  )

  return () =>
    pipe(
      controls,
      autoSwitchInputScheme,

      (controls) => ({
        move: pipe(
          controls.move,

          copyVector(
            activeDevice === "keyboard"
              ? getKeyboardVector()
              : getGamepadVector()
          ),

          applyDeadzone(0.05),
          clampVector
        ),

        jump: pipe(false, jumpFlow)
      })
    )
}

export default function Example({ playerSpeed = 3 }) {
  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  let doubleJumped = false

  const controller = useInputController({
    gamepad: 0,
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    onJump: () => {
      if (player.current.position.y == 0) {
        doubleJumped = false
        velocity.y = 5
      } else if (!doubleJumped) {
        doubleJumped = true
        velocity.y = 5
      }
    }
  })

  useFrame((_, dt) => {
    const { move, jump } = controller()

    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )
  })

  useFrame((_, dt) => {
    player.current.position.add(tmpVec3.copy(velocity).multiplyScalar(dt))

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
