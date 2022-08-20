import { MeshProps } from "@react-three/fiber"
import { makeStore, useStore, State } from "./lib/statery"
import { MeshPhysicalMaterial } from "three"
import { VFXMaterial } from "vfx-composer"

/* The library */
const makeResourceStore = <S extends State>(initialState?: S) => {
  const store = makeStore<S>(initialState || ({} as S))

  const capture = new Proxy<
    {
      [K in keyof S]: (value: S[K]) => void
    }
  >(store.state, {
    get: (target, name) => {
      return (value: S[keyof S]) => {
        console.log("Setting", name, value)
        store.set({ [name]: value } as S)
      }
    }
  })

  const retrieve = new Proxy<
    {
      [K in keyof S]: S[K]
    }
  >(store.state, {
    get: (target, name) => {
      const value = useStore(store)[name]
      console.log("Retrieving", name)
      console.log("Value:", value)
      return value
    }
  })

  return { capture, retrieve }
}

const { capture, retrieve } = makeResourceStore<{
  expensiveMaterial: MeshPhysicalMaterial
  reallyExpensiveMaterial: VFXMaterial
}>()

export default function Playground() {
  return (
    <group position-y={1.5}>
      <Materials />
      <Thingy />
    </group>
  )
}

const Materials = () => (
  <meshPhysicalMaterial
    ref={capture.expensiveMaterial}
    color="#dda15e"
    metalness={0.8}
    roughness={0.5}
  />
)

const Thingy = (props: MeshProps) => (
  <mesh material={retrieve.expensiveMaterial} {...props}>
    <icosahedronGeometry />
  </mesh>
)
