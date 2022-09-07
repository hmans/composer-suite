import { GroupProps, useFrame } from "@react-three/fiber"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group } from "three"
import gamepadDriver, { GamepadDevice } from "input-composer/drivers/gamepad"
import { identity, pipe } from "fp-ts/lib/function"
import { clampVector, IVector, resetVector } from "input-composer"

const getGamepadVector =
  (gamepad: GamepadDevice, horizontalAxis = 0, verticalAxis = 1) =>
  (v: IVector) => {
    v.x = gamepad.getAxis(horizontalAxis)
    v.y = gamepad.getAxis(verticalAxis)
    return v
  }

const makeController = () => {
  const state = {
    gamepad: null as GamepadDevice | null,
    activeDevice: null as GamepadDevice | null
  }

  const controls = {
    move: { x: 0, y: 0 }
  }

  gamepadDriver.start()

  gamepadDriver.onDeviceAppeared.addListener((gamepad) => {
    state.gamepad = gamepad

    state.gamepad.onActivity.addListener(() => {
      state.activeDevice = state.gamepad
    })
  })

  return {
    move: () =>
      pipe(
        controls.move,
        resetVector,
        state.gamepad && state.activeDevice === state.gamepad
          ? getGamepadVector(state.gamepad, 0, 1)
          : identity,
        clampVector
      )
  }
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const controller = useMemo(() => makeController(), [])

  useFrame((_, dt) => {
    gamepadDriver.update()
    const move = controller.move()
    console.log(move)
    // player.current.position.add(move.multiplyScalar(playerSpeed * dt))
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
