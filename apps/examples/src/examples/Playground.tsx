import { useRerender } from "@hmans/use-rerender"
import { applyProps, MeshProps, Node } from "@react-three/fiber"
import {
  cloneElement,
  createRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef
} from "react"
import { Mesh, MeshPhysicalMaterial } from "three"

type Constructor = { new (...args: any[]): any }

type Props<C extends Constructor> = Node<InstanceType<C>, C>

const createSharedResource = () => {
  const instance = {
    current: undefined
  }

  const Root = ({ children }: { children: ReactNode }) => {
    const modified = cloneElement(children, {
      ref: (c) => {
        console.log("setting instance", c)
        instance.current = c
      }
    })

    return <>{modified}</>
  }

  const Instance = () => {
    const rerender = useRerender()

    useLayoutEffect(() => {
      rerender()
    }, [])

    return instance.current ? (
      <primitive object={instance.current} attach="material" />
    ) : null
  }

  return { Root, Instance }
}

const ThingyMaterial = createSharedResource()

export default function Playground() {
  return (
    <group position-y={1.5}>
      <ThingyMaterial.Root>
        <meshPhysicalMaterial name="ThingyMaterial" color="hotpink" />
      </ThingyMaterial.Root>

      {/* Render two thingies! */}
      <Thingy position-x={-1} />
      <Thingy position-x={1} />
    </group>
  )
}

const Thingy = (props: MeshProps) => {
  const mesh = useRef<Mesh>(null!)

  return (
    <mesh {...props} ref={mesh}>
      <icosahedronGeometry />
      <ThingyMaterial.Instance />
    </mesh>
  )
}
