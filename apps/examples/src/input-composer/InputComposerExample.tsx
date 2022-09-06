import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe } from "fp-ts/lib/function"
import { clampVector, resetVector } from "input-composer"
import {
  GamepadDevice,
  onGamepadConnected
} from "input-composer/drivers/gamepad"
import { getKeyboardDevice } from "input-composer/drivers/keyboard"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

const makeController = () => {
  const controlSchemes = {
    keyboard: { keyboard: getKeyboardDevice() },
    gamepad: { gamepad: undefined as GamepadDevice | undefined }
  }

  type ControlScheme = typeof controlSchemes[keyof typeof controlSchemes]

  let activeScheme: ControlScheme = controlSchemes.keyboard

  onGamepadConnected((g) => {
    controlSchemes.gamepad.gamepad = g
    switchScheme(controlSchemes.gamepad)
  })

  const switchScheme = (scheme: ControlScheme) => {
    console.log("Switching active control scheme to:", scheme)
    activeScheme = scheme
  }

  const moveVector = { x: 0, y: 0 }
  const tmpVec3 = new Vector3()

  const move = () =>
    pipe(
      moveVector,
      resetVector,
      activeScheme === controlSchemes.keyboard
        ? activeScheme.keyboard.getVector()
        : identity,
      activeScheme === controlSchemes.gamepad
        ? activeScheme.gamepad!.getVector(0, 1)
        : identity,
      clampVector,
      (v) => tmpVec3.set(v.x, 0, -v.y)
    )

  return { move }
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const controller = useMemo(() => makeController(), [])

  useFrame((_, dt) => {
    const move = controller.move()
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
