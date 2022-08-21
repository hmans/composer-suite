import { sharedResource } from "@hmans/r3f-shared-resource"

const SharedMaterial = sharedResource(() => (
  <meshPhysicalMaterial name="ThingyMaterial" color="hotpink" />
))

export default function Playground() {
  return (
    <group position-y={1.5}>
      <SharedMaterial.Resource />

      <mesh position-x={-1.5}>
        <sphereGeometry />
        <SharedMaterial />
      </mesh>

      <mesh position-x={+1.5}>
        <dodecahedronGeometry />
        <SharedMaterial />
      </mesh>
    </group>
  )
}
