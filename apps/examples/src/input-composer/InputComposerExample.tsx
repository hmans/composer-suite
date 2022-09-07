import { GroupProps, useFrame } from "@react-three/fiber"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group } from "three"
import gamepadDriver, { GamepadDevice } from "input-composer/drivers/gamepad"

const makeController = () => {
  const state = {
    gamepad: null as GamepadDevice | null
  }

  gamepadDriver.start()

  gamepadDriver.onDeviceAppeared.addListener((gamepad) => {
    state.gamepad = gamepad

    state.gamepad.onActivity.addListener(() => {
      // TODO: make gamepad the active device
    })
  })

  return {
    move: () => state.gamepad?.getAxis("0")
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
