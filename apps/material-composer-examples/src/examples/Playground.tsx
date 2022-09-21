import { Composable, Modules } from "material-composer-r3f"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <Composable.MeshStandardMaterial>
          <Modules.Color color="#ff0000" />
        </Composable.MeshStandardMaterial>
      </mesh>
    </group>
  )
}
