import { MeshProps, Node, useFrame } from "@react-three/fiber"
import { FC, useRef } from "react"
import { Mesh, MeshPhysicalMaterial } from "three"

type Constructor = { new (...args: any[]): any }

type Props<C extends Constructor> = Node<InstanceType<C>, C>

const sharedResource = <P extends any>(component: FC<P>) => (props: P) =>
  component(props)

export default function Playground() {
  const ref = useRef<Mesh<any, MeshPhysicalMaterial>>(null!)

  useFrame(({ clock }) => {
    ref.current!.material.color.setScalar(
      (Math.sin(clock.elapsedTime * 3) + 1) / 2
    )
  })

  return (
    <group position-y={1.5}>
      <mesh position-x={-1.5}>
        <sphereGeometry />
        <ThingyMaterial />
      </mesh>

      <mesh position-x={+1.5} ref={ref}>
        <dodecahedronGeometry />
        <ThingyMaterial />
      </mesh>
    </group>
  )
}

const ThingyMaterial = sharedResource(() => (
  <meshPhysicalMaterial name="ThingyMaterial" color="hotpink" />
))

const ThingyThatMutatesTheMaterial = (props: MeshProps) => {
  return (
    <mesh {...props}>
      <icosahedronGeometry />
      <ThingyMaterial />
    </mesh>
  )
}
