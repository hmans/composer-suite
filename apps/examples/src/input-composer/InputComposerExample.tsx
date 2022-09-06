import { FlatStage } from "r3f-stage"
import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"

type Vector = { x: number; y: number }

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

const getKeyboardVector =
  (keyboard: ReturnType<typeof keyboardDevice>) => (v: Vector) => {
    v.x = -1 * keyboard.isPressed("a") + 1 * keyboard.isPressed("d")
    v.y = -1 * keyboard.isPressed("s") + 1 * keyboard.isPressed("w")
    return v
  }

export default function Example() {
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

  useFrame(() => {
    const move = moveControl()
    console.log(move)
  })

  return (
    <FlatStage>
      <Player />
    </FlatStage>
  )
}

const Player = () => {
  return (
    <mesh position-y={0.5} castShadow>
      <capsuleGeometry args={[0.25, 0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
