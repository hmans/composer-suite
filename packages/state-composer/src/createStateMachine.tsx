import React, { ReactNode } from "react"
import { makeStore, useStore } from "statery"

export const createStateMachine = <S extends string>(initialState: S) => {
  const store = makeStore({
    state: initialState as S
  })

  const matchesState = (state: S, other: S | S[]) =>
    Array.isArray(other) ? other.includes(state) : state === other

  const Match = ({
    state,
    children
  }: {
    state: S | S[]
    children?: ReactNode
  }) => {
    const { state: currentState } = useStore(store)

    return matchesState(currentState, state) ? <>{children}</> : null
  }

  const enter = (state: S) => {
    const { state: currentState } = store.state

    if (state && state !== currentState) {
      store.set({ state })
    }
  }

  const is = (state: S | S[]) => matchesState(store.state.state, state)

  return {
    Match,
    enter,
    is
  }
}
