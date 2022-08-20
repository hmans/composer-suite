import { MeshProps } from "@react-three/fiber"
import { makeStore, useStore, State } from "statery"
import { MeshPhysicalMaterial } from "three"

/* The library */
const makeResourceStore = <S extends State>(initialState?: S) => {
  const store = makeStore<S>(initialState || ({} as S))

  const capture = <K extends keyof S>(name: K) => (value: S[K]) =>
    store.set({ [name]: value } as S)

  const useResources = () => useStore(store)

  return { useResources, capture }
}

/* The consumer */
const { useResources, capture } = makeResourceStore<{
  material: MeshPhysicalMaterial
}>()

export default function Playground() {
  return (
    <group position-y={1.5}>
      <meshPhysicalMaterial
        ref={capture("material")}
        color="#dda15e"
        metalness={0.8}
        roughness={0.5}
      />

      <Thingy />
    </group>
  )
}

const Thingy = (props: MeshProps) => {
  const { material } = useResources()

  return (
    <mesh material={material} {...props}>
      <icosahedronGeometry />
    </mesh>
  )
}
