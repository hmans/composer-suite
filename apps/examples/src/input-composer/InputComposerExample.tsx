import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { getKeyboardVector, normalizeVector, resetVector } from "input-composer"
import { getKeyboardDevice } from "input-composer/drivers/keyboard"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const moveControl = useMemo(() => {
    const keyboard = getKeyboardDevice()

    const moveVector = { x: 0, y: 0 }
    const tmpVec3 = new Vector3()

    const activeDevice = keyboard

    return () =>
      pipe(
        moveVector,
        resetVector,
        (v) => (activeDevice === keyboard ? getKeyboardVector(keyboard)(v) : v),
        normalizeVector,
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
