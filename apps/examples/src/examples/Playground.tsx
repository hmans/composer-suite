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

const resource = {
  instance: null
}

const useSharedResource = <C extends Constructor>(
  constructor: C,
  args: ConstructorParameters<C>,
  props: Props<C>
) => {
  if (!resource.instance)
    resource.instance = applyProps(new constructor(args), props as any)

  return resource.instance
}

const SharedResource = <C extends Constructor>({
  constructor,
  args,
  ...props
}: { constructor: C } & Props<C>) => {
  const resource = useSharedResource(constructor, args, props)
  return <primitive object={resource} attach="material" />
}

const ThingyMaterial = () => (
  <SharedResource
    constructor={MeshPhysicalMaterial}
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
