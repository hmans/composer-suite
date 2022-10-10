import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect
} from "react"
import { Bucket, IEntity } from "./bucket"
import { useConst } from "@hmans/use-const"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export type EntityProps<E extends IEntity> = {
  children?: ReactNode
}

export type PropertyProps<E extends IEntity, P extends keyof E> = {
  name: P
  value?: E[P]
  children?: ReactNode
}

export const createComponents = <E extends IEntity>(bucket: Bucket<E>) => {
  const EntityContext = createContext<E | null>(null)

  const Entity = ({ children }: EntityProps<E>) => {
    const entity = useConst(() => ({} as E))

    useIsomorphicLayoutEffect(() => {
      bucket.write(entity)
      return () => bucket.remove(entity)
    })

    return (
      <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>
    )
  }

  const Property = <P extends keyof E>(props: PropertyProps<E, P>) => {
    const entity = useContext(EntityContext)

    /* Handle setting of value */
    useIsomorphicLayoutEffect(() => {
      if (!entity) return
      if (props.value === undefined) return

      entity[props.name] = props.value
      bucket.write(entity)
    }, [entity, props.name, props.value])

    /* Handle setting of child value */
    const children = props.children
      ? React.cloneElement(
          React.Children.only(props.children) as ReactElement,
          { ref: (ref: E[P]) => (entity![props.name] = ref) }
        )
      : null

    return <>{children}</>
  }

  return { Entity, Property }
}
