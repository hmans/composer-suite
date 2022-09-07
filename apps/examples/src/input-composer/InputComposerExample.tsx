import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe } from "fp-ts/lib/function"
import {
  applyDeadzone,
  clampVector,
  getGamepadVector,
  getKeyboardVector,
  IDevice,
  resetVector
} from "input-composer"
import gamepadDriver, { GamepadDevice } from "input-composer/drivers/gamepad"
import keyboardDriver, { KeyboardDevice } from "input-composer/drivers/keyboard"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

const tmpVec3 = new Vector3()

const makeController = () => {
  const state = {
    keyboard: null as KeyboardDevice | null,
    gamepad: null as GamepadDevice | null,
    activeDevice: null as IDevice | null
  }

  const controls = {
    move: { x: 0, y: 0 }
  }

  const setActiveDevice = (device: IDevice) => {
    if (state.activeDevice === device) return
    console.log("Switching active device to:", device)
    state.activeDevice = device
  }

  gamepadDriver.start()
  keyboardDriver.start()

  gamepadDriver.onDeviceAppeared.addListener((gamepad) => {
    state.gamepad = gamepad
    state.gamepad.onActivity.addListener(() => setActiveDevice(gamepad))
  })

  keyboardDriver.onDeviceAppeared.addListener((keyboard) => {
    state.keyboard = keyboard
    state.keyboard.onActivity.addListener(() => setActiveDevice(keyboard))
  })

  return {
    move: () =>
      pipe(
        controls.move,
        resetVector,

        state.gamepad && state.activeDevice === state.gamepad
          ? getGamepadVector(state.gamepad, 0, 1)
          : identity,

        state.keyboard && state.activeDevice === state.keyboard
          ? getKeyboardVector(state.keyboard, "w", "s", "a", "d")
          : identity,

        applyDeadzone(0.1),
        clampVector
      )
  }
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const controller = useMemo(() => makeController(), [])

  useFrame((_, dt) => {
    gamepadDriver.update()
    keyboardDriver.update()

    const move = controller.move()
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
