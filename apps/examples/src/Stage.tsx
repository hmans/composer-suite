export const Stage = () => (
  <group>
    <mesh position-y={-64}>
      <cylinderGeometry args={[16, 16, 128, 64]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  </group>
)
