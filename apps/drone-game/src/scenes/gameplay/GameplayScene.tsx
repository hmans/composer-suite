import { Environment, PerspectiveCamera } from "@react-three/drei"
import { GroupProps, Object3DProps, useFrame } from "@react-three/fiber"
import {
  CuboidCollider,
  Debug,
  Physics,
  RigidBody,
  RigidBodyApi
} from "@react-three/rapier"
import { RigidBodyProps } from "@react-three/rapier/dist/declarations/src/RigidBody"
import { useRef } from "react"
import { PerspectiveCamera as PerspectiveCameraImpl } from "three"
import { useInput } from "input-composer/react"
import { Vector3 } from "three"
import { Quaternion } from "three"

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

      <Physics colliders={false}>
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
    const gamepad = input.gamepad.gamepad(0)

    const leftStick = {
      x: gamepad?.axis(0) ?? 0,
      y: gamepad?.axis(1) ?? 0
    }

    const rightStick = {
      x: gamepad?.axis(2) ?? 0,
      y: gamepad?.axis(3) ?? 0
    }

    const leftTrigger = gamepad?.button(6) ?? 0
    const rightTrigger = gamepad?.button(7) ?? 0

    body.current.resetForces()
    body.current.resetTorques()

    camera.current.getWorldQuaternion(tmpQuat)

    body.current.addForce(
      tmpVec3
        .set(leftStick.x * 600, -leftStick.y * 1000, 0)
        .applyQuaternion(tmpQuat)
    )

    body.current.addForce(
      tmpVec3.set(0, 0, leftTrigger * 200).applyQuaternion(tmpQuat)
    )

    body.current.addForce(
      tmpVec3.set(0, 0, rightTrigger * -400).applyQuaternion(tmpQuat)
    )

    body.current.addTorque(
      tmpVec3
        .set(rightStick.y * 50, rightStick.x * -50, 0)
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
    >
      <PerspectiveCamera ref={camera} makeDefault />
      <CuboidCollider args={[2, 2, 2]} />
    </RigidBody>
  )
}
