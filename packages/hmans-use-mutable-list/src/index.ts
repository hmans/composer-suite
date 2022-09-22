import { useLayoutEffect, useState } from "react"

export type MutableListAPI<T> = {
  list: T[]
  addItem: (item: T) => void
  removeItem: (item: T) => void
  useItem: (item: T) => void
  version: number
  bumpVersion: () => void
}

export const useMutableList = <T>(): MutableListAPI<T> => {
  const [state, setState] = useState(() => ({
    list: new Array<T>(),
    version: 0
  }))

  const bumpVersion = () =>
    setState((state) => ({ ...state, version: state.version + 1 }))

  const addItem = (item: T) => {
    state.list.push(item)
  }

  const removeItem = (item: T) => {
    const index = state.list.indexOf(item)
    if (index !== -1) state.list.splice(index, 1)
  }

  const useItem = (item: T) => {
    /*
    Every time the module changes, bump the version of the list.
    */
    useLayoutEffect(() => {
      bumpVersion()
      return () => bumpVersion()
    }, [item])

    /*
    Only ever mutate the lists on a version change. This guarantees that we
    will do it sequentially.
    */
    useLayoutEffect(() => {
      addItem(item)
      return () => removeItem(item)
    }, [state.version])
  }

  return {
    ...state,
    bumpVersion,
    useItem,
    addItem,
    removeItem
  }
}
