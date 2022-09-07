import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { IVector } from "input-composer"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useLayoutEffect, useMemo, useRef } from "react"
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

  return { isPressed }
}

const useController = (props: ControllerProps) => {
  const vector: IVector = useConst(() => ({ x: 0, y: 0 }))

  const { isPressed } = useKeyboardInput()

  const getMoveVector = () =>
    pipe(
      vector,

      (v) => {
        v.x = isPressed(props.right) - isPressed(props.left)
        v.y = isPressed(props.up) - isPressed(props.down)
        return v
      }

      // (v) => {
      //   const data = navigator.getGamepads()[props.gamepad]
      //   if (data) {
      //     v.x = data.axes[0]
      //     v.y = -data.axes[1]
      //   }
      //   return v
      // }
    )

  return { getMoveVector }
}

export default function Example({ playerSpeed = 3 }) {
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
    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )
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
