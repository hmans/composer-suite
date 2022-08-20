export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry />
        <meshPhysicalMaterial color="#dda15e" metalness={0.8} roughness={0.5} />
      </mesh>
    </group>
  )
}
