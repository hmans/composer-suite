export default function FireballExample() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial color={0xffff00} />
      </mesh>
    </group>
  )
}
