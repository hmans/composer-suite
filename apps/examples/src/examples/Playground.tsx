export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[7]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  )
}
