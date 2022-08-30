import { cloneElement, FC, useLayoutEffect, useRef } from "react"
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
  const Use = ({ attach = "material" }: { attach?: string }) => {
    /* Fetch the instance from the store, reactively */
    const { instance } = useStore(store)

    const group = useRef<any>(null!)

    useLayoutEffect(() => {
      if (!instance) return

      const { parent } = group.current.__r3f
      if (!parent) return

      parent[attach] = instance
    }, [instance])

    /* We're going to add a group to the scene so we can figure out
    the parent of the material. This is a bit hacky, but it works.
    With a bit of luck, we'll be able to tune this with a future
    version of R3F. */
    return <group ref={group} />
  }

  return { Mount, Use }
}
