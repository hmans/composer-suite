import { ReactNode } from "react"
import { makeStore, useStore } from "statery"

export const makeFSM = <S extends string>(initialState: S) => {
  const store = makeStore({
    state: initialState as S
  })

  const matchesState = (state: S, other: S | S[]) =>
    Array.isArray(other) ? other.includes(state) : state === other

  const MatchState = ({
    state,
    children
  }: {
    state: S | S[]
    children?: ReactNode
  }) => {
    const { state: currentState } = useStore(store)

    return matchesState(currentState, state) ? <>{children}</> : null
  }

  const enterState = (state: S) => {
    const { state: currentState } = store.state

    if (state && state !== currentState) {
      store.set({ state })
    }
  }

  const isCurrentState = (state: S | S[]) =>
    matchesState(store.state.state, state)

  return {
    MatchState,
    enterState,
    isCurrentState
  }
}
