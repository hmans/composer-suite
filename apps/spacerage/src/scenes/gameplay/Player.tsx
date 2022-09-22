import { Collider, RigidBody, RigidBodyEntity } from "@hmans/physics3d"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useInput } from "input-composer"
import { useRef } from "react"
import { Vector3 } from "three"
import { Stage } from "../../configuration"
import { useCapture } from "../../lib/useCapture"
import { gameplayStore } from "./state"

const tmpVec3 = new Vector3()

export const Player = () => {
  const rb = useRef<RigidBodyEntity>(null!)

  const gltf = useGLTF("/models/spaceship25.gltf")
  const input = useInput()

  useFrame(() => {
    const horizontal = input.keyboard.axis("KeyA", "KeyD")
    const vertical = input.keyboard.axis("KeyS", "KeyW")

    const { body } = rb.current

    body.resetForces(true)
    body.resetTorques(true)

    /* Move player */
    body.addForce({ x: horizontal * 200, y: vertical * 200, z: 0 }, true)

    // /* Rotate player in direction of movement */
    // const velocity = tmpVec3.copy(body.current.linvel()).normalize()

    // const forward = new Vector3(-1, 0, 0).applyQuaternion(
    //   body.current.rotation()
    // )
    // // console.log(forward)
    // const dot = forward.dot(velocity)
    // console.log(dot)

    // // Rotate the player into the direction of his velocity
    // body.current.addTorque({
    //   x: 0,
    //   y: 0,
    //   z: dot * 0.1
    // })
  }, Stage.Early)

  return (
    <RigidBody
      ref={rb}
      angularDamping={1}
      linearDamping={1}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <group ref={useCapture(gameplayStore, "player")}>
        <Collider shape="cuboid" args={[1, 1, 1]} />
        <primitive object={gltf.scene} scale={0.3} />
      </group>
    </RigidBody>
  )
}
