import { FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { Group, Vector3 } from "three"

type Vector = { x: number; y: number }

const tmpVec3 = new Vector3()

const resetVector = (v: Vector) => {
  v.x = 0
  v.y = 0

  return v
}

const normalizeVector = (v: Vector) => {
  const length = Math.sqrt(v.x * v.x + v.y * v.y)

  if (length > 0) {
    v.x /= length
    v.y /= length
  }

  return v
}

type KeyboardDevice = ReturnType<typeof keyboardDevice>

const keyboardDevice = () => {
  const keys: Record<string, boolean> = {}

  const onKeyDown = (e: KeyboardEvent) => {
    keys[e.key] = true
  }

  const onKeyUp = (e: KeyboardEvent) => {
    keys[e.key] = false
  }

  const isPressed = (key: string) => (keys[key] ? 1 : 0)

  const isReleased = (key: string) => (keys[key] ? 0 : 1)

  const start = () => {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
  }

  const stop = () => {
    window.removeEventListener("keydown", onKeyDown)
    window.removeEventListener("keyup", onKeyUp)
  }

  return { isPressed, isReleased, start, stop }
}

const getKeyboardAxis = (
  keyboard: KeyboardDevice,
  negative: string,
  positive: string
) => keyboard.isPressed(positive) - keyboard.isPressed(negative)

const getKeyboardVector = (keyboard: KeyboardDevice) => (v: Vector) => {
  v.x = getKeyboardAxis(keyboard, "a", "d")
  v.y = getKeyboardAxis(keyboard, "s", "w")
  return v
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const moveControl = useMemo(() => {
    const keyboard = keyboardDevice()
    keyboard.start()

    const moveVector = { x: 0, y: 0 }

    return () =>
      pipe(
        moveVector,
        resetVector,
        getKeyboardVector(keyboard),
        normalizeVector
      )
  }, [])

  useFrame((_, dt) => {
    const move = moveControl()
    console.log(move)

    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )
  })

  return (
    <FlatStage>
      <Player ref={player} />
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
