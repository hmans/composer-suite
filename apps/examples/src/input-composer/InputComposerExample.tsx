import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { Group, Vector3 } from "three"
import { Vector } from "input-composer"

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

type KeyboardDriver = ReturnType<typeof KeyboardDriver>

type KeyboardDevice = ReturnType<KeyboardDriver["getDevice"]>

const KeyboardDriver = () => {
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

  const getAxis = (negative: string, positive: string) =>
    isPressed(positive) - isPressed(negative)

  const getDevice = () => ({
    isPressed,
    isReleased,
    getAxis
  })

  return { getDevice, start, stop }
}

const getKeyboardVector = (keyboard: KeyboardDevice) => (v: Vector) => {
  v.x = keyboard.getAxis("a", "d")
  v.y = keyboard.getAxis("s", "w")
  return v
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const moveControl = useMemo(() => {
    const keyboardDriver = KeyboardDriver()
    keyboardDriver.start()
    const keyboard = keyboardDriver.getDevice()

    const moveVector = { x: 0, y: 0 }
    const tmpVec3 = new Vector3()

    return () =>
      pipe(
        moveVector,
        resetVector,
        getKeyboardVector(keyboard),
        normalizeVector,

        /* Convert it into a THREE.Vector3 */
        (v) => tmpVec3.set(v.x, 0, -v.y)
      )
  }, [])

  useFrame((_, dt) => {
    const move = moveControl()
    player.current.position.add(move.multiplyScalar(playerSpeed * dt))
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
