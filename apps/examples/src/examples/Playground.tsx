import { MeshProps } from "@react-three/fiber"

export default function Playground() {
  return (
    <group position-y={1.5}>
      {/* Render two thingies! */}
      <Thingy position-x={-1} />
      <Thingy position-x={1} />
    </group>
  )
}

const ReallyHeavyMaterial = () => {
  /* INSERT MEMOIZATION HERE, but not of the component,
  but the actual material, aaaaaahahahahaha help */

  return (
    <meshPhysicalMaterial
      color="#dda15e"
      metalness={0.8}
      roughness={0.5}
      transmission={1}
    />
  )
}

const Thingy = (props: MeshProps) => (
  <mesh {...props}>
    <icosahedronGeometry />
    <ReallyHeavyMaterial />
  </mesh>
)
