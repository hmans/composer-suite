/* TODO: extract into @hmans/things */

export interface IEvent<P = void> {
  (listener: Listener<P>): void
}

type Listener<P> = (payload: P) => void

export const createEvent = <P = void>() => {
  const listeners = new Set<Listener<P>>()

  const on = (listener: Listener<P>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const emit = (payload: P) => {
    for (const listener of listeners) {
      listener(payload)
    }
  }

  on.emit = emit

  return on
}
