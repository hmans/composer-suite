export type ValueFactory<T> = T | (() => T)

export function getValue<T extends number>(fov: ValueFactory<T>): T {
  return typeof fov === "function" ? fov() : fov
}
