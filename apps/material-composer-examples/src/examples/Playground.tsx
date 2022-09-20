import { Color, composable } from "material-composer-r3f"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <composable.meshStandardMaterial>
          <Color color="hotpink" />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
