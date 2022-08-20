import { MeshProps } from "@react-three/fiber"
import { makeStore, State, useStore } from "statery"
import { BufferGeometry, MeshPhysicalMaterial } from "three"
import { VFXMaterial } from "vfx-composer"

/* The library */

type CaptureProxy<S extends State> = {
  [K in keyof S]: (value: S[K]) => void
}

const makeResourceStore = <S extends State>(initialState?: S) => {
  const store = makeStore<S>(initialState || ({} as S))

  const capture = new Proxy<CaptureProxy<S>>(store.state, {
    get: (_, name: string) => {
      return (value: any) => {
        store.set({ [name]: value } as S)
      }
    }
  })

  const retrieve = new Proxy<S>(store.state, {
    get: (_, name: string) => {
      return useStore(store)[name]
    }
  })

  return { capture, retrieve }
}

const { capture, retrieve } = makeResourceStore<{
  expensiveMaterial: MeshPhysicalMaterial
  geometry: BufferGeometry
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
