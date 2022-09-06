import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { Group, Vector3 } from "three"
import { IVector } from "input-composer"
import { getKeyboardDevice, Keyboard } from "input-composer/drivers/keyboard"

const resetVector = (v: IVector) => {
  v.x = 0
  v.y = 0

  return v
}

const normalizeVector = (v: IVector) => {
  const length = Math.sqrt(v.x * v.x + v.y * v.y)

  if (length > 0) {
    v.x /= length
    v.y /= length
  }

  return v
}

const getKeyboardVector = (keyboard: Keyboard) => (v: IVector) => {
  v.x = keyboard.getAxis("a", "d")
  v.y = keyboard.getAxis("s", "w")
  return v
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const moveControl = useMemo(() => {
    const keyboard = getKeyboardDevice()

    /* Define some objects here so we don't create new ones every frame */
    const moveVector = { x: 0, y: 0 }
    const tmpVec3 = new Vector3()

    const activeDevice = keyboard

    return () =>
      pipe(
        /* We'll start with our move vector */
        moveVector,

        /* Reset it to 0/0 */
        resetVector,

        /* Set it to the keyboard input */
        (v) => (activeDevice === keyboard ? getKeyboardVector(keyboard)(v) : v),

        /* Normalize it */
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
