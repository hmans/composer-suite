import React, { cloneElement, FC } from "react"
import { mergeRefs } from "react-merge-refs"
import { makeStore, useStore } from "statery"
import { BufferGeometry, Material } from "three"

export const sharedResource = <P extends any>(component: FC<P>) => {
  const store = makeStore<{ instance?: any }>({})

  const Resource = (props: P) => {
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
    In a future R3F version, the following will no longer be necessary.
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

  Use.Resource = Resource

  return Use
}
