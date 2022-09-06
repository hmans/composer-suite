import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe } from "fp-ts/lib/function"
import { getKeyboardVector, IVector, resetVector } from "input-composer"
import {
  GamepadDevice,
  onGamepadConnected
} from "input-composer/drivers/gamepad"
import { getKeyboardDevice } from "input-composer/drivers/keyboard"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

const getGamepadVector =
  (gamepad: GamepadDevice, horizontalAxis = 0, verticalAxis = 1) =>
  (v: IVector) => {
    v.x = gamepad.state.axes[horizontalAxis]
    v.y = -gamepad.state.axes[verticalAxis]
    return v
  }

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const moveControl = useMemo(() => {
    /* Get a reference to a/the keyboard device */
    const keyboard = getKeyboardDevice()

    /* Store a reference to the player's gamepad */
    let gamepad: GamepadDevice

    onGamepadConnected((g) => {
      gamepad = g
      activeDevice = gamepad
    })

    const moveVector = { x: 0, y: 0 }
    const tmpVec3 = new Vector3()
    let activeDevice: any = keyboard

    return () => {
      return pipe(
        moveVector,
        resetVector,
        activeDevice === keyboard ? getKeyboardVector(keyboard) : identity,
        activeDevice === gamepad ? getGamepadVector(gamepad) : identity,
        // normalizeVector,
        (v) => tmpVec3.set(v.x, 0, -v.y)
      )
    }
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
