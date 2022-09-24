import {
  ConvexHullCollider,
  RigidBody,
  RigidBodyEntity
} from "@hmans/physics3d"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useInput } from "input-composer"
import { useRef } from "react"
import { useStore } from "statery"
import { Mesh, Quaternion, Vector3 } from "three"
import { Stage } from "../../configuration"
import { useCapture } from "../../lib/useCapture"
import { gameplayStore } from "./state"

const tmpVec3 = new Vector3()
const tmpQuat = new Quaternion()

export const Player = () => {
  const rb = useRef<RigidBodyEntity>(null!)

  const gltf = useGLTF("/models/spaceship25.gltf")
  const input = useInput()
  const { player } = useStore(gameplayStore)

  useFrame(() => {
    if (!player) return

    const horizontal = input.keyboard.axis("KeyA", "KeyD")
    const vertical = input.keyboard.axis("KeyS", "KeyW")

    const { body } = rb.current

    body.resetForces(true)
    body.resetTorques(true)

    /* Rotate the player */
    body.addTorque(tmpVec3.set(0, 0, -40).multiplyScalar(horizontal), true)

    /* Thrust */
    const thrust = tmpVec3
      .set(0, vertical * 100, 0)
      .applyQuaternion(player.getWorldQuaternion(tmpQuat))

    body.addForce(thrust, true)
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
        <group scale={0.5}>
          <ConvexHullCollider
            points={
              (gltf.scene.children[0] as Mesh).geometry.attributes.position
                .array as Float32Array
            }
          />
          <primitive object={gltf.scene} />
        </group>
      </group>
    </RigidBody>
  )
}
