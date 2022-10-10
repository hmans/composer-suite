import React, {
  createContext,
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
  value: E[P]
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

  const Property = <P extends keyof E>({
    name,
    value
  }: PropertyProps<E, P>) => {
    const entity = useContext(EntityContext)

    useIsomorphicLayoutEffect(() => {
      if (!entity) return

      entity[name] = value
      bucket.write(entity)
    }, [entity, name, value])

    return null
  }

  return { Entity, Property }
}
