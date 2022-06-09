export const Stage = () => (
  <group>
    <mesh position-y={-256}>
      <cylinderGeometry args={[16, 16, 512, 64]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  </group>
)
