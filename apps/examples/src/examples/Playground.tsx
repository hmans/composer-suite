import { useFrame } from "@react-three/fiber"
import { cloneElement, FC, useRef } from "react"
import { makeStore, useStore } from "statery"
import { BufferGeometry, Material, Mesh, MeshPhysicalMaterial } from "three"

const sharedResource = <P extends any>(component: FC<P>) => {
  const store = makeStore<{ instance?: any }>({})

  const Define = (props: P) =>
    cloneElement(component(props)!, {
      ref: (instance: any) => store.set({ instance })
    })

  const Emit = () => {
    const { instance } = useStore(store)

    /*
    In a future R3F version, this will not be necessary.
    https://github.com/pmndrs/react-three-fiber/pull/2449
    */
    const attach =
      instance instanceof Material
        ? "material"
        : instance instanceof BufferGeometry
        ? "geometry"
        : undefined

    return instance ? <primitive object={instance} attach={attach} /> : null
  }

  return { Define, Emit }
}

export default function Playground() {
  const ref = useRef<Mesh<any, MeshPhysicalMaterial>>(null!)

  /*
  For testing, we'll mutate one of the mesh's material's
  color. If the resource sharing works, the colors of both
  meshes will update.
  */
  useFrame(({ clock }) => {
    ref.current!.material.color.setScalar(
      (Math.sin(clock.elapsedTime * 3) + 1) / 2
    )
  })

  return (
    <group position-y={1.5}>
      <ThingyMaterial.Define />

      <mesh position-x={-1.5}>
        <sphereGeometry />
        <ThingyMaterial.Emit />
      </mesh>

      <mesh position-x={+1.5} ref={ref}>
        <dodecahedronGeometry />
        <ThingyMaterial.Emit />
      </mesh>
    </group>
  )
}

const ThingyMaterial = sharedResource(() => (
  <meshPhysicalMaterial name="ThingyMaterial" color="hotpink" />
))
