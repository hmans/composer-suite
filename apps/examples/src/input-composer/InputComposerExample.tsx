import { useConst } from "@hmans/things"
import { GroupProps, useFrame } from "@react-three/fiber"
import { flow, pipe } from "fp-ts/lib/function"
import { onPressed } from "input-composer"
import { useInput } from "input-composer/react"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useCallback, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"
import { createStandardController } from "./createStandardController"

const tmpVec3 = new Vector3()

export default function Example({ playerSpeed = 3 }) {
  const input = useInput()
  const velocity = useConst(() => new Vector3())
  const player = useRef<Group>(null!)

  /* A callback that will make the player jump when the player is on the ground,
  and double-jump once while they are in the air. */
  const doubleJump = useMemo(() => {
    let doubleJumped = false

    return () => {
      if (player.current.position.y == 0) {
        doubleJumped = false
        velocity.y = 5
      } else if (!doubleJumped) {
        doubleJumped = true
        velocity.y = 5
      }
    }
  }, [velocity, player])

  const controller = useMemo(() => createStandardController(input), [input])

  const controllerFlow = useMemo(() => {
    const performDoubleJump = onPressed(doubleJump)

    return (c: ReturnType<typeof controller>) => ({
      ...c,
      jump: performDoubleJump(c.jump)
    })
  }, [doubleJump])

  const controllerWithProcessing = useMemo(
    () => flow(controller, controllerFlow),
    [controller, controllerFlow]
  )

  useFrame((_, dt) => {
    const { jump, move } = controllerWithProcessing()

    player.current.position.add(
      tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    )
  })

  useFrame((_, dt) => {
    /* Apply velocity */
    player.current.position.add(tmpVec3.copy(velocity).multiplyScalar(dt))

    /* Apply gravity to velocity */
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
