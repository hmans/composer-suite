export type ValueFunction<T> = () => T

export type ValueFactory<T> = T | ValueFunction<T>

export function getValue<T>(fov: ValueFactory<T>): T {
  return typeof fov === "function" ? (fov as ValueFunction<T>)() : fov
}
