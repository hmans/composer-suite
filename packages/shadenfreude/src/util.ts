/**
 * This file contains helpers internal to the library.
 */

export function idGenerator(initial: number = 0): () => number {
  let id = initial
  return () => ++id
}

export function tableize(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/, "_")
}
