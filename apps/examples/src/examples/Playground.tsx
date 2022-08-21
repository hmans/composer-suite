import { applyProps, MeshProps, Node } from "@react-three/fiber"
import { apply } from "fp-ts/lib/function"
import {
  cloneElement,
  FC,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
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

const SharedResource = <C extends { new (...args: any[]): any }>({
  constructor,
  args,
  ...props
}: { constructor: C } & Omit<Node<InstanceType<C>, C>, "constructor">) => {
  const [instance, setInstance] = useState(() => {
    return applyProps(new constructor(args), props)
  })

  return <primitive object={instance} attach="material" />
}

const ReallyHeavyMaterial = () => {
  /* INSERT MEMOIZATION HERE, but not of the component,
        but the actual material, aaaaaahahahahaha help */

  return (
    <SharedResource
      constructor={MeshPhysicalMaterial}
      color="#dda15e"
      metalness={0.8}
      roughness={0.5}
      transmission={1}
      attach="material"
    />
  )
}

const Thingy = (props: MeshProps) => {
  const mesh = useRef<Mesh>(null!)

  useEffect(() => {
    // @ts-ignore
    console.log(mesh.current.material.uuid)
  })

  return (
    <mesh {...props} ref={mesh}>
      <icosahedronGeometry />
      <ReallyHeavyMaterial />
    </mesh>
  )
}
