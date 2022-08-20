import { MeshProps } from "@react-three/fiber"
import { makeStore, useStore, State } from "statery"
import { MeshPhysicalMaterial } from "three"

/* The library */
const makeResourceStore = <S extends State>(initialState?: S) => {
  const store = makeStore<S>(initialState || ({} as S))

  const captureResource = <K extends keyof S>(name: K) => (value: S[K]) =>
    store.set({ [name]: value } as S)

  const useResources = () => useStore(store)

  const useResource = <K extends keyof S>(name: K) => useStore(store)[name]

  return { useResource, useResources, captureResource }
}

/* The consumer */
const { useResources, captureResource } = makeResourceStore<{
  expensiveMaterial: MeshPhysicalMaterial
}>()

export default function Playground() {
  return (
    <group position-y={1.5}>
      <meshPhysicalMaterial
        ref={captureResource("expensiveMaterial")}
        color="#dda15e"
        metalness={0.8}
        roughness={0.5}
      />

      <Thingy />
    </group>
  )
}

const Thingy = (props: MeshProps) => (
  <mesh material={useResources().expensiveMaterial} {...props}>
    <icosahedronGeometry />
  </mesh>
)
