import * as MC from "material-composer-r3f"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <MC.MeshStandardMaterial>
          <MC.Color color="yellow" />
        </MC.MeshStandardMaterial>
      </mesh>
    </group>
  )
}
