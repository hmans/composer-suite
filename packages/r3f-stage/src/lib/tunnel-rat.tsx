import React, { ReactNode, useLayoutEffect } from "react"
import create, { SetState } from "zustand"

type Props = { children: React.ReactNode }

type State = {
  current: Array<React.ReactNode>
  version: number
  set: SetState<State>
}

export default function tunnel() {
  const useStore = create<State>((set) => ({
    current: new Array<ReactNode>(),
    version: 0,
    set
  }))

  return {
    In: ({ children }: Props) => {
      const set = useStore((state) => state.set)
      const version = useStore((state) => state.version)

      /* When this component mounts, we increase the store's version number.
      This will cause all existing rats to re-render (just like if the Out component
      were mapping items to a list.) The re-rendering will cause the final 
      order of rendered components to match what the user is expecting. */
      useLayoutEffect(() => {
        set((state) => ({
          version: state.version + 1
        }))
      }, [])

      /* Any time the children _or_ the store's version number change, insert
      the specified React children into the list of rats. */
      useLayoutEffect(() => {
        set(({ current }) => ({
          current: [...current, children]
        }))

        return () =>
          set(({ current }) => ({
            current: current.filter((c) => c !== children)
          }))
      }, [children, version])

      return null
    },

    Out: () => {
      const current = useStore((state) => state.current)
      return <>{current}</>
    }
  }
}
