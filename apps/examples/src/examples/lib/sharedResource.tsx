import { cloneElement, FC } from "react"
import { mergeRefs } from "react-merge-refs"
import { makeStore, useStore } from "statery"

export const sharedResource = <P extends any>(component: FC<P>) => {
  const store = makeStore<{ instance?: any }>({})

  /**
   * Mounts the shared resource. This component will create the actual
   * resource and store a reference to it in its local store.
   */
  const Mount = (props: P) => {
    const element = component(props)
    if (!element) return null

    return cloneElement(element, {
      ref: mergeRefs([
        (element as any).ref,
        (instance: any) => store.set({ instance })
      ])
    })
  }

  /**
   * Use the shared resource. This requires the resource to be mounted
   * through the `Mount` component.
   */
  const Use = () => {
    /* Fetch the instance from the store, reactively */
    const { instance } = useStore(store)

    /* If we already have an instance, return it as a primitive. Otherwise,
    render nothing for the moment. */
    return instance ? <primitive object={instance} /> : null
  }

  return { Mount, Use }
}
