import { cloneElement, FC } from "react"
import { mergeRefs } from "react-merge-refs"
import { makeStore, useStore } from "statery"
import { BufferGeometry, ColorRepresentation, Material } from "three"

const sharedResource = <P extends any>(component: FC<P>) => {
  const store = makeStore<{ instance?: any }>({})

  const Create = (props: P) => {
    const element = component(props)
    if (!element) return null

    return cloneElement(element, {
      ref: mergeRefs([
        (element as any).ref,
        (instance: any) => store.set({ instance })
      ])
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

/*
Write a component that creates a resource you want to reuse. Wrap
it in the sharedResource decorator.
*/

const ThingyMaterial = sharedResource(
  ({ color = "hotpink" }: { color: ColorRepresentation }) => {
    return <meshPhysicalMaterial name="ThingyMaterial" color={color} />
  }
)

export default function Playground() {
  return (
    <group position-y={1.5}>
      <ThingyMaterial.Create color="green" />

      <mesh position-x={-1.5}>
        <sphereGeometry />
        <ThingyMaterial.Use />
      </mesh>

      <mesh position-x={+1.5}>
        <dodecahedronGeometry />
        <ThingyMaterial.Use />
      </mesh>
    </group>
  )
}
