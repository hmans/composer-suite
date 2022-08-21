import { useFrame } from "@react-three/fiber"
import { cloneElement, FC, forwardRef, useRef } from "react"
import { makeStore, useStore } from "statery"
import { BufferGeometry, Material, Mesh, MeshPhysicalMaterial } from "three"
import { mergeRefs } from "react-merge-refs"

const sharedResource = <P extends any>(component: FC<P>) => {
  const store = makeStore<{ instance?: any }>({})

  const Create = (props: P) => {
    const element = component(props) as any

    return cloneElement(element, {
      ref: mergeRefs([element.ref, (instance: any) => store.set({ instance })])
    })
  }

  const Use = () => {
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

  return { Create, Use }
}

/* Write a component that creates a resource you want to reuse. Wrap
        it in the sharedResource decorator. */
const ThingyMaterial = sharedResource(() => {
  const ref = useRef<MeshPhysicalMaterial>(null!)

  useFrame(() => {
    console.log(ref.current)
  })

  return (
    <meshPhysicalMaterial name="ThingyMaterial" color="hotpink" ref={ref} />
  )
})

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
      {/* Explicitly create the shared resource. This gives you control
                  over when and where the resource is created, and how long it'll
                  stick around. */}
      <ThingyMaterial.Create />

      <mesh position-x={-1.5}>
        <sphereGeometry />

        {/* Use the shared resource! */}
        <ThingyMaterial.Use />
      </mesh>

      <mesh position-x={+1.5} ref={ref}>
        <dodecahedronGeometry />

        {/* Use it again! */}
        <ThingyMaterial.Use />
      </mesh>
    </group>
  )
}
