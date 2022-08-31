import { useState } from "react"

export type MutableListAPI<T> = {
  list: T[]
  addItem: (item: T) => void
  removeItem: (item: T) => void
  version: number
  bumpVersion: () => void
}

export const useMutableList = <T>(): MutableListAPI<T> => {
  const [state, setState] = useState(() => ({
    list: new Array<T>(),
    version: 0
  }))

  const bumpVersion = () => setState({ ...state, version: state.version + 1 })

  return {
    ...state,

    bumpVersion,

    addItem: (item: T) => {
      state.list.push(item)
    },

    removeItem: (item: T) => {
      // console.log("removeItem", item)
      const index = state.list.indexOf(item)
      if (index !== -1) state.list.splice(index, 1)
    }
  }
}
