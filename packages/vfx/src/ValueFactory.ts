export type ValueFactory<T> = T | (() => T)

export function getValue<T>(fov: ValueFactory<T>): T {
  return typeof fov === "function" ? fov() : fov
}
