import { MeshStandardMaterialProps } from "@react-three/fiber"

type ModularShaderMaterialProps = MeshStandardMaterialProps

function ModularShaderMaterial({
  children,
  ...props
}: ModularShaderMaterialProps) {
  return <meshStandardMaterial {...props}>{children}</meshStandardMaterial>
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
