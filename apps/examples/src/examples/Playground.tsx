import { applyProps, MeshProps, Node } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Mesh, MeshPhysicalMaterial } from "three"

export default function Playground() {
  return (
    <group position-y={1.5}>
      {/* Render two thingies! */}
      <Thingy position-x={-1} />
      <Thingy position-x={1} />
    </group>
  )
}

type Constructor = { new (...args: any[]): any }

type Props<C extends Constructor> = Node<InstanceType<C>, C>

const createSharedResource = <C extends Constructor>(constructor: C) => {
  return (props: Props<C>) => {
    return null
  }
}

const SharedThingyMaterial = createSharedResource(MeshPhysicalMaterial)

const ThingyMaterial = () => (
  <SharedThingyMaterial
    color="#dda15e"
    metalness={0.8}
    roughness={0.5}
    transmission={1}
    attach="material"
  />
)

const Thingy = (props: MeshProps) => {
  const mesh = useRef<Mesh>(null!)

  useEffect(() => {
    // @ts-ignore
    console.log(mesh.current.material.uuid)
  })

  return (
    <mesh {...props} ref={mesh}>
      <icosahedronGeometry />
      <ThingyMaterial />
    </mesh>
  )
}
