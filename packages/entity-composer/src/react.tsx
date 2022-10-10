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
import { useRerender } from "@hmans/use-rerender"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export type EntityProps<E extends IEntity> = Partial<E> & {
  entity?: E
  children?: ReactNode
}

export type PropertyProps<E extends IEntity, P extends keyof E> = {
  name: P
  value?: E[P]
  children?: ReactNode
}

export const createComponents = <E extends IEntity>(bucket: Bucket<E>) => {
  const EntityContext = createContext<E | null>(null)

  const Entity = ({
    children,
    entity: existingEntity,
    ...props
  }: EntityProps<E>) => {
    const entity = useConst(() => existingEntity ?? ({} as E))

    useIsomorphicLayoutEffect(() => {
      bucket.write(entity, props as Partial<E>)
      if (existingEntity) return
      return () => bucket.remove(entity)
    }, [])

    return (
      <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>
    )
  }

  const Property = <P extends keyof E>(props: PropertyProps<E, P>) => {
    const entity = useContext(EntityContext)

    if (!entity) {
      throw new Error("Property must be a child of Entity")
    }

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
          {
            ref: (ref: E[P]) => {
              bucket.write(entity, { [props.name]: ref })
            }
          }
        )
      : null

    return <>{children}</>
  }

  return { Entity, Property, useBucket }
}

export const useBucket = <E extends IEntity>(bucket: Bucket<E>) => {
  const rerender = useRerender()

  useIsomorphicLayoutEffect(() => {
    bucket.onEntityAdded.addListener(rerender)
    bucket.onEntityRemoved.addListener(rerender)

    return () => {
      bucket.onEntityAdded.removeListener(rerender)
      bucket.onEntityRemoved.removeListener(rerender)
    }
  }, [])

  return bucket
}
