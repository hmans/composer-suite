import { cloneElement, FC } from "react"
import { mergeRefs } from "react-merge-refs"
import { makeStore, useStore } from "statery"

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
    return instance ? <primitive object={instance} /> : null
  }

  Use.Resource = Resource

  return Use
}
