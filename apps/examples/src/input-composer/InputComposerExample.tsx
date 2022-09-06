import { GroupProps, useFrame } from "@react-three/fiber"
import { flow, identity, pipe } from "fp-ts/lib/function"
import {
  clampVector,
  getKeyboardVector,
  IVector,
  resetVector
} from "input-composer"
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

    return () => {
      return pipe(
        moveVector,
        resetVector,
        activeScheme === controlSchemes.keyboard
          ? getKeyboardVector(controlSchemes.keyboard.keyboard)
          : identity,
        activeScheme === controlSchemes.gamepad
          ? getGamepadVector(controlSchemes.gamepad.gamepad!)
          : identity,
        clampVector,
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
