import React, {
  createContext,
  memo,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect
} from "react"
import { Bucket, id, IEntity } from "./index"
import { useConst } from "@hmans/use-const"
import { useRerender } from "@hmans/use-rerender"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export const createBucketComponents = <E extends IEntity>(
  bucket: Bucket<E>
) => {
  const EntityContext = createContext<E | null>(null)

  /* TODO: Do we really want/need two separate components for "new entities" and "existing entities"? */

  const Entity = ({
    children,
    ...props
  }: {
    children?: ReactNode
  } & E) => {
    const entity = useConst(() => props as E)

    useIsomorphicLayoutEffect(() => {
      bucket.add(entity)
      return () => bucket.remove(entity)
    }, [])

    return (
      <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>
    )
  }

  const ExistingEntity = ({
    children,
    entity
  }: {
    entity: E
    children?: ReactNode
  }) => {
    return (
      <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>
    )
  }

  const MemoizedExistingEntity = memo(ExistingEntity)

  const Bucket = <D extends E>({
    bucket,
    children
  }: {
    bucket: Bucket<D>
    children?: ReactNode | ((entity: D) => ReactNode)
  }) => {
    useBucket(bucket)

    return (
      <>
        {bucket.entities.map((entity, i) => (
          <MemoizedExistingEntity key={id(entity)} entity={entity}>
            {typeof children === "function" ? children(entity) : children}
          </MemoizedExistingEntity>
        ))}
      </>
    )
  }

  const Property = <P extends keyof E>(props: {
    name: P
    value?: E[P]
    children?: ReactNode
  }) => {
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

  return { Entity, ExistingEntity, Property, Bucket }
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
