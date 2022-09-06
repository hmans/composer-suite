/* TODO: extract into @hmans/things */

type Listener<P> = (payload: P) => void

export const createEvent = <P>() => {
  const listeners = new Set<Listener<P>>()

  const on = (listener: Listener<P>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const emit = (payload: P = undefined as P) => {
    for (const listener of listeners) {
      listener(payload)
    }
  }

  on.emit = emit

  return on
}
