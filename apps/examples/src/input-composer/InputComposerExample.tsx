import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { identity, pipe } from "fp-ts/lib/function"
import { applyDeadzone, clampVector, IVector, magnitude } from "input-composer"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useEffect, useRef, useState } from "react"
import { Group, Vector3 } from "three"
import { useGamepadInput, useKeyboardInput } from "input-composer/react"

const tmpVec3 = new Vector3()

type ControllerProps = {
  gamepad: number
  up: string
  down: string
  left: string
  right: string
}

const useActiveInputScheme = () => {
  const [activeInputScheme, setActiveInputScheme] = useState<
    "keyboard" | "gamepad"
  >("keyboard")

  /* Log when the input scheme has changed. */
  useEffect(() => {
    console.log("Active input scheme:", activeInputScheme)
  }, [activeInputScheme])

  const when = <T,>(s: "keyboard" | "gamepad", fun: (p: T) => T) =>
    activeInputScheme === s ? fun : identity

  return {
    current: activeInputScheme,
    set: setActiveInputScheme,
    when
  }
}

const copyVector = (source: IVector) => (v: IVector) => {
  v.x = source.x
  v.y = source.y
  return v
}

const onPressedDown = () => {
  let pushed = false

  return (button: boolean) => {
    if (button && !pushed) {
      pushed = true
      console.log("pressed!")
    } else if (!button) {
      pushed = false
    }

    return button
  }
}

const useInputController = (props: ControllerProps) => {
  const keyboard = useKeyboardInput()
  const gamepad = useGamepadInput(props.gamepad)
  const scheme = useActiveInputScheme()

  const getKeyboardVector = () =>
    keyboard.getVector(props.up, props.down, props.left, props.right)

  const getGamepadVector = () => gamepad.getVector(0, 1)

  const controls = {
    move: { x: 0, y: 0 },
    fire: false
  }

  const autoSwitchInputScheme = <T extends any>(payload: T) => {
    const keyboardVector = getKeyboardVector()
    const gamepadVector = getGamepadVector()

    if (magnitude(keyboardVector)) {
      scheme.set("keyboard")
    }

    if (magnitude(gamepadVector) > 0) {
      scheme.set("gamepad")
    }

    return payload
  }

  const eh = onPressedDown()

  return () =>
    pipe(
      controls,
      autoSwitchInputScheme,

      (controls) => ({
        move: pipe(
          controls.move,

          scheme.when(
            "keyboard",
            copyVector(
              keyboard.getVector(props.up, props.down, props.left, props.right)
            )
          ),

          scheme.when("gamepad", copyVector(gamepad.getVector(0, 1))),

          applyDeadzone(0.05),
          clampVector
        ),

        jump: pipe(false, (v) => !!gamepad.getButton(0), eh)
      })
    )
}

export default function Example({ playerSpeed = 3 }) {
  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  const controller = useInputController({
    gamepad: 0,
    up: "w",
    down: "s",
    left: "a",
    right: "d"
  })

  useFrame((_, dt) => {
    const { move, jump } = controller()

    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )

    if (jump) {
      if (player.current.position.y == 0) {
        velocity.y = 5
      }
    }
  })

  useFrame((_, dt) => {
    player.current.position.add(tmpVec3.copy(velocity).multiplyScalar(dt))

    velocity.y -= 20 * dt

    if (player.current.position.y < 0) {
      velocity.y = 0
      player.current.position.y = 0
    }
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
