import { useFrame } from "@react-three/fiber"
import React, { useRef } from "react"
import { Mesh } from "three"

export const Spinner = () => {
  const mesh = useRef<Mesh>(null!)

  useFrame(({ clock }, dt) => {
    const a = Math.pow((Math.sin(clock.elapsedTime * 7) + 2) * 0.5, 3)
    mesh.current.rotation.y += (1 + a) * dt
  })

  return (
    <mesh ref={mesh} scale={0.2}>
      <dodecahedronGeometry />
      <meshStandardMaterial color="#666" />
    </mesh>
  )
}
