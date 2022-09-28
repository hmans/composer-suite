import { IEntity, IndexFunction, World } from "./vanilla"
import { useRerender } from "@hmans/use-rerender"
import { useLayoutEffect, useMemo } from "react"

export function createWorldComponents<Entity extends IEntity>(
  world: World<Entity>
) {
  function useIndex(fun: IndexFunction<Entity>) {
    const rerender = useRerender()
    const index = useMemo(() => world.index(fun), [fun])

    useLayoutEffect(() => {
      index.onEntityAdded.addListener(rerender)
      index.onEntityRemoved.addListener(rerender)

      return () => {
        index.onEntityAdded.removeListener(rerender)
        index.onEntityRemoved.removeListener(rerender)
      }
    }, [fun])

    return index.entities
  }

  return {
    ...world,
    useIndex
  }
}
