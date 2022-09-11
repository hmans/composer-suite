import { Environment, PerspectiveCamera } from "@react-three/drei"
import { GroupProps, useFrame } from "@react-three/fiber"
import {
  CuboidCollider,
  Physics,
  RigidBody,
  RigidBodyApi
} from "@react-three/rapier"
import { useRef } from "react"
import {
  PerspectiveCamera as PerspectiveCameraImpl,
  Quaternion,
  Vector3
} from "three"
import { Debris } from "./Debris"
import { GroundFog } from "./GroundFog"
import { useInput } from "input-composer"

export const GameplayScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        color="white"
        intensity={0.7}
        position={[10, 10, 10]}
        castShadow
      />
      <directionalLight
        color="white"
        intensity={0.2}
        position={[-10, 5, 10]}
        castShadow
      />

      <Physics colliders={false} gravity={[0, 0, 0]}>
        {/* <Debug color="red" sleepColor="blue" /> */}
        <Player position={[0, 10, 20]} />

        {/* Scenery */}
        <RigidBody colliders="hull" position-y={3}>
          <mesh castShadow rotation={[0.2, 0.2, 0.2]}>
            <dodecahedronGeometry />
            <meshStandardMaterial
              color="hotpink"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </RigidBody>

        {/* Ground */}
        <RigidBody type="kinematicPosition">
          <Ground />
          <CuboidCollider position={[0, -0.5, 0]} args={[100, 0.5, 100]} />
        </RigidBody>

        <GroundFog />
        <Debris />
      </Physics>

      <fogExp2 args={["#000", 0.03]} attach="fog" />
      <Environment preset="sunset" />
    </>
  )
}

const Ground = (props: GroupProps) => (
  <group {...props}>
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  </group>
)

const tmpVec3 = new Vector3()
const tmpQuat = new Quaternion()

const Player = (props: Parameters<typeof RigidBody>[0]) => {
  const body = useRef<RigidBodyApi>(null!)
  const camera = useRef<PerspectiveCameraImpl>(null!)

  const input = useInput()

  useFrame(() => {
    const gamepad = input.gamepad(0)
    const keyboard = input.keyboard

    const inputs = {
      leftStick: {
        keyboard: keyboard.vector("KeyS", "KeyW", "KeyA", "KeyD"),
        gamepad: gamepad.vector(0, 1)
      },

      rightStick: {
        keyboard: keyboard.vector(
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight"
        ),
        gamepad: gamepad.vector(2, 3)
      },

      leftBumper: {
        gamepad: gamepad.button(4),
        keyboard: keyboard.key("KeyQ")
      },

      rightBumper: {
        gamepad: gamepad.button(5),
        keyboard: keyboard.key("KeyE")
      },

      leftTrigger: {
        keyboard: keyboard.key("ControlLeft"),
        gamepad: gamepad.button(6)
      },

      rightTrigger: {
        keyboard: keyboard.key("Space"),
        gamepad: gamepad.button(7)
      }
    }

    /* Extract inputs depending on current device */
    const currentDevice = "gamepad"
    const leftStick = inputs.leftStick[currentDevice]
    const rightStick = inputs.rightStick[currentDevice]

    const leftTrigger = inputs.leftTrigger[currentDevice]
    const rightTrigger = inputs.rightTrigger[currentDevice]

    const leftBumper = inputs.leftBumper[currentDevice]
    const rightBumper = inputs.rightBumper[currentDevice]

    body.current.resetForces()
    body.current.resetTorques()

    camera.current.getWorldQuaternion(tmpQuat)

    /* Thrust */
    body.current.addForce(
      tmpVec3
        .set(0, 0, -(rightTrigger * 1000 - leftTrigger * 500))
        .applyQuaternion(tmpQuat)
    )

    /* Lateral movement */
    body.current.addForce(
      tmpVec3.set(0, rightStick.y * -200, 0).applyQuaternion(tmpQuat)
    )

    body.current.addTorque(
      tmpVec3.set(0, rightStick.x * -100, 0).applyQuaternion(tmpQuat)
    )

    body.current.addTorque(
      tmpVec3
        .set(0, 0, (rightBumper - leftBumper) * -100)
        .applyQuaternion(tmpQuat)
    )

    body.current.addTorque(
      tmpVec3
        .set(leftStick.y * 100, leftStick.x * -100, leftStick.x * -100)
        .applyQuaternion(tmpQuat)
    )
  })

  return (
    <RigidBody
      restitution={2}
      {...props}
      ref={body}
      angularDamping={1}
      linearDamping={1}
      onCollisionEnter={({ manifold }) => {
        console.log(
          "Collision at world position ",
          manifold.solverContactPoint(0)
        )
      }}
      onCollisionExit={() => {
        console.log("Collision ended")
      }}
    >
      <PerspectiveCamera ref={camera} makeDefault />
      <CuboidCollider args={[2, 2, 2]} />
    </RigidBody>
  )
}
