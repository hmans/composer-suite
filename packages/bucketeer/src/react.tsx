import React, {
  createContext,
  memo,
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
      if (existingEntity) return

      bucket.add(entity)
      bucket.update(entity, props as Partial<E>)
      return () => bucket.remove(entity)
    }, [])

    return (
      <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>
    )
  }

  const MemoizedEntity = memo(Entity)

  const Bucket = ({
    bucket,
    children
  }: {
    bucket: Bucket<E>
    children?: ReactNode | ((entity: E) => ReactNode)
  }) => {
    useBucket(bucket)

    return (
      <>
        {bucket.entities.map((entity, i) => (
          <MemoizedEntity key={i} entity={entity}>
            {typeof children === "function" ? children(entity) : children}
          </MemoizedEntity>
        ))}
      </>
    )
  }

  const Property = <P extends keyof E>(props: PropertyProps<E, P>) => {
    const entity = useContext(EntityContext)

    if (!entity) {
      throw new Error("Property must be a child of Entity")
    }

    /* Handle setting of value */
    useIsomorphicLayoutEffect(() => {
      if (props.value === undefined) return
      bucket.update(entity, { [props.name]: props.value } as any)
    }, [entity, props.name, props.value])

    /* Handle setting of child value */
    const children = props.children
      ? React.cloneElement(
          React.Children.only(props.children) as ReactElement,
          {
            ref: (ref: E[P]) =>
              bucket.update(entity, { [props.name]: ref } as any)
          }
        )
      : null

    return <>{children}</>
  }

  return { Entity, MemoizedEntity, Property, Bucket }
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

  useIsomorphicLayoutEffect(rerender, [])

  return bucket
}
