import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, RigidBodyApi } from "@react-three/rapier"
import { useInput } from "input-composer"
import { useRef } from "react"
import { useStore } from "statery"
import { Vector3 } from "three"
import { useCapture } from "../../lib/useCapture"
import { store } from "../../state"
import { gameplayStore } from "./state"

const offset = new Vector3(0, 0, 10)
const tmpVec3 = new Vector3()

export const Player = () => {
  const body = useRef<RigidBodyApi>(null!)
  const gltf = useGLTF("/models/spaceship25.gltf")
  const input = useInput()
  const { camera } = useStore(store)
  const { player } = useStore(gameplayStore)

  useFrame(() => {
    const horizontal = input.keyboard.axis("KeyA", "KeyD")
    const vertical = input.keyboard.axis("KeyS", "KeyW")

    body.current.resetForces()

    body.current.addForce({ x: horizontal * 2, y: vertical * 2, z: 0 })
  }, -100)

  useFrame(() => {
    /* Move camera */
    if (camera && player) {
      player.getWorldPosition(tmpVec3)
      camera.lookAt(tmpVec3)
      camera.position.lerp(tmpVec3.add(offset), 0.1)
    }
  }, -50)

  return (
    <RigidBody
      ref={body}
      linearDamping={2}
      angularDamping={0.5}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
    >
      <group ref={useCapture(gameplayStore, "player")}>
        <primitive object={gltf.scene} scale={0.1} />
      </group>
    </RigidBody>
  )
}
