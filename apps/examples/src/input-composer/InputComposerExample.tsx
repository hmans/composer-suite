import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe } from "fp-ts/lib/function"
import { applyDeadzone, clampVector, IVector, magnitude } from "input-composer"
import { Description, FlatStage } from "r3f-stage"
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { Group, Vector3 } from "three"
import { useConst } from "@hmans/things"

const tmpVec3 = new Vector3()

type ControllerProps = {
  gamepad: number
  up: string
  down: string
  left: string
  right: string
}

const useKeyboardInput = () => {
  const keyState = useConst(() => new Map<string, boolean>())

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyState.set(e.key, true)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState.set(e.key, false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const isPressed = (key: string) => (keyState.get(key) ? 1 : 0)

  const getAxis = (minKey: string, maxKey: string) =>
    isPressed(maxKey) - isPressed(minKey)

  const getVector = (
    upKey: string,
    downKey: string,
    leftKey: string,
    rightKey: string
  ) => ({
    x: getAxis(leftKey, rightKey),
    y: getAxis(downKey, upKey)
  })

  return { isPressed, getAxis, getVector }
}

const useGamepadInput = (index: number) => {
  const getGamepadState = () => navigator.getGamepads()[index]

  const getButton = (buttonIndex: number) => {
    const gamepad = getGamepadState()
    return gamepad?.buttons[buttonIndex]?.pressed ? 1 : 0
  }

  const getAxis = (axis: number) => getGamepadState()?.axes[axis]

  const getVector = (axisX: number, axisY: number) => {
    const state = getGamepadState()
    if (!state) return undefined

    return {
      x: state.axes[axisX],
      y: state.axes[axisY]
    }
  }

  return { getGamepadState, getButton, getAxis, getVector }
}

const useController = (props: ControllerProps) => {
  const keyboard = useKeyboardInput()
  const gamepad = useGamepadInput(props.gamepad)

  const vector: IVector = useConst(() => ({ x: 0, y: 0 }))
  const [activeInputScheme, setActiveInputScheme] = useState<
    "keyboard" | "gamepad"
  >("keyboard")

  useEffect(() => {
    console.log("Active input scheme:", activeInputScheme)
  }, [activeInputScheme])

  const getMoveVector = () =>
    pipe(
      vector,

      (v) => {
        const keyboardVector = keyboard.getVector(
          props.up,
          props.down,
          props.left,
          props.right
        )

        if (magnitude(keyboardVector)) {
          setActiveInputScheme("keyboard")
        }

        if (activeInputScheme === "keyboard") {
          v.x = keyboardVector.x
          v.y = keyboardVector.y
        }

        return v
      },

      (v) => {
        const gamepadVector = gamepad.getVector(0, 1)
        if (gamepadVector) {
          if (magnitude(gamepadVector) > 0) {
            setActiveInputScheme("gamepad")
          }

          if (activeInputScheme === "gamepad") {
            v.x = gamepadVector.x
            v.y = -gamepadVector.y
          }
        }
        return v
      },

      applyDeadzone(0.1),
      clampVector
    )

  const getJumpButton = () => pipe(false, (v) => gamepad.getButton(0))

  return { getMoveVector, getJumpButton }
}

export default function Example({ playerSpeed = 3 }) {
  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  const controller = useController({
    gamepad: 0,
    up: "w",
    down: "s",
    left: "a",
    right: "d"
  })

  useFrame((_, dt) => {
    const move = controller.getMoveVector()
    const jump = controller.getJumpButton()

    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )

    if (jump) {
      if (player.current.position.y == 0) {
        velocity.y = 5
      }
    }
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
