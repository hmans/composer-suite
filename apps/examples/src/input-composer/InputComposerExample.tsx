import { useConst } from "@hmans/things"
import { GroupProps, useFrame, useThree } from "@react-three/fiber"
import { flow } from "fp-ts/lib/function"
import { createPressInteraction } from "input-composer"
import { useInput } from "input-composer"
import { Description } from "r3f-stage"
import {
  forwardRef,
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { Group, PerspectiveCamera, Vector3 } from "three"
import {
  createStandardController,
  StandardControllerState
} from "./createStandardController"

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

  /* Let's define a jump interaction. Only reason we want to do this outside of
  the per-frame processing callbacks is so that the state of onPressed doesn't
  get reset every time. */
  const jumpInteraction = useMemo(() => {
    const performDoubleJump = createPressInteraction(doubleJump)

    return (c: StandardControllerState) => ({
      ...c,
      jump: performDoubleJump(c.jump)
    })
  }, [doubleJump])

  /* Let's grab a controller and extend it with our own processing flows. */
  const controller = useMemo(
    () => flow(createStandardController(input), jumpInteraction),
    [input]
  )

  useFrame((_, dt) => {
    const { jump, move } = controller()

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
    <Stage>
      <SmartCamera />

      <Player ref={player} />

      <Description>
        A playground for prototyping <strong>Input Composer</strong>, the
        successor to <strong>Controlfreak</strong>.
      </Description>
    </Stage>
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

const Stage = ({ children }: PropsWithChildren) => {
  return (
    <group position-y={-1.5}>
      {/* Floor */}
      <mesh receiveShadow rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#678" />
      </mesh>

      <mesh castShadow receiveShadow position={[-3, 0, -5]}>
        <dodecahedronGeometry />
        <meshStandardMaterial color="#890" />
      </mesh>

      <mesh castShadow receiveShadow position={[2, 0, -3]}>
        <icosahedronGeometry />
        <meshStandardMaterial color="#823" />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        position={[2, 0, -10]}
        scale={3}
        rotation={[-1, -0.5, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#211" />
      </mesh>

      {/* Everything else */}
      {children}
    </group>
  )
}

const SmartCamera = () => {
  const camera = useRef<PerspectiveCamera>(null!)
  const r3f = useThree()

  /* Register as active camera */
  useLayoutEffect(() => {
    r3f.set({ camera: camera.current })
  }, [camera])

  useFrame(({ camera }, dt) => {
    // camera.position.z -= dt
  })

  return <perspectiveCamera position={[0, 3, 7]} ref={camera} />
}
