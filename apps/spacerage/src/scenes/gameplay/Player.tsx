import { useGLTF } from "@react-three/drei"
import { Vector3 } from "three"
import { useCapture } from "../../lib/useCapture"
import { gameplayStore } from "./state"

const tmpVec3 = new Vector3()

export const Player = () => {
  // const body = useRef<RigidBodyApi>(null!)
  const gltf = useGLTF("/models/spaceship25.gltf")
  // const input = useInput()

  // useFrame(() => {
  //   const horizontal = input.keyboard.axis("KeyA", "KeyD")
  //   const vertical = input.keyboard.axis("KeyS", "KeyW")

  //   body.current.resetForces()
  //   body.current.resetTorques()

  //   /* Move player */
  //   body.current.addForce({ x: horizontal * 2, y: vertical * 2, z: 0 })

  //   /* Rotate player in direction of movement */
  //   const velocity = tmpVec3.copy(body.current.linvel()).normalize()

  //   const forward = new Vector3(-1, 0, 0).applyQuaternion(
  //     body.current.rotation()
  //   )
  //   // console.log(forward)
  //   const dot = forward.dot(velocity)
  //   console.log(dot)

  //   // Rotate the player into the direction of his velocity
  //   body.current.addTorque({
  //     x: 0,
  //     y: 0,
  //     z: dot * 0.1
  //   })
  // }, Stage.Early)

  return (
    <group ref={useCapture(gameplayStore, "player")}>
      <primitive object={gltf.scene} scale={0.1} />
    </group>
  )
}
