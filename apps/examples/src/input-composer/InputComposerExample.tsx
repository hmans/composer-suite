import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe } from "fp-ts/lib/function"
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
}

const useActiveInputScheme = () => {
  const [activeInputScheme, setActiveInputScheme] = useState<
    "keyboard" | "gamepad"
  >("keyboard")

  /* Log when the input scheme has changed. */
  useEffect(() => {
    console.log("Active input scheme:", activeInputScheme)
  }, [activeInputScheme])

  return [activeInputScheme, setActiveInputScheme] as const
}

const useInputController = (props: ControllerProps) => {
  const keyboard = useKeyboardInput()
  const gamepad = useGamepadInput(props.gamepad)
  const [activeInputScheme, setActiveInputScheme] = useActiveInputScheme()

  const getKeyboardVector = () =>
    keyboard.getVector(props.up, props.down, props.left, props.right)

  const getGamepadVector = () => gamepad.getVector(0, 1)

  const move: IVector = useConst(() => ({ x: 0, y: 0 }))

  const getControls = () => {
    const keyboardVector = getKeyboardVector()
    const gamepadVector = getGamepadVector()

    return {
      move: pipe(
        move,

        (v) => {
          if (magnitude(keyboardVector)) {
            setActiveInputScheme("keyboard")
          }

          if (gamepadVector && magnitude(gamepadVector) > 0) {
            setActiveInputScheme("gamepad")
          }

          return v
        },

        activeInputScheme === "keyboard"
          ? (v) => {
              v.x = keyboardVector.x
              v.y = keyboardVector.y

              return v
            }
          : identity,

        activeInputScheme === "gamepad"
          ? (v) => {
              if (gamepadVector) {
                v.x = gamepadVector.x
                v.y = -gamepadVector.y
              }
              return v
            }
          : identity,

        applyDeadzone(0.05),
        clampVector
      ),

      jump: pipe(false, (v) => gamepad.getButton(0))
    }
  }

  return { getControls }
}

export default function Example({ playerSpeed = 3 }) {
  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  const controller = useInputController({
    gamepad: 0,
    up: "w",
    down: "s",
    left: "a",
    right: "d"
  })

  useFrame((_, dt) => {
    const { move, jump } = controller.getControls()

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
