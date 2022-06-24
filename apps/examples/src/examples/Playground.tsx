import { MeshStandardMaterialProps } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import { MeshStandardMaterial } from "three"

type ModularShaderMaterialProps = MeshStandardMaterialProps

function ModularShaderMaterial({
  children,
  ...props
}: ModularShaderMaterialProps) {
  const material = useRef<MeshStandardMaterial>(null!)

  useLayoutEffect(() => {}, [])

  return (
    <meshStandardMaterial ref={material} {...props}>
      {children}
    </meshStandardMaterial>
  )
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[7]} />

        <ModularShaderMaterial color="red"></ModularShaderMaterial>
      </mesh>
    </group>
  )
}
