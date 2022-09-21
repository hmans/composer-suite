import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, RigidBodyApi } from "@react-three/rapier"
import { useInput } from "input-composer"
import { useRef } from "react"

export const Player = () => {
  const body = useRef<RigidBodyApi>(null!)
  const gltf = useGLTF("/models/spaceship25.gltf")
  const input = useInput()

  useFrame(() => {
    const horizontal = input.keyboard.axis("KeyA", "KeyD")
    const vertical = input.keyboard.axis("KeyS", "KeyW")

    body.current.resetForces()

    body.current.addForce({ x: horizontal * 2, y: vertical * 2, z: 0 })
  })

  return (
    <RigidBody
      ref={body}
      linearDamping={2}
      angularDamping={0.5}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
    >
      <primitive object={gltf.scene} scale={0.1} />
    </RigidBody>
  )
}
