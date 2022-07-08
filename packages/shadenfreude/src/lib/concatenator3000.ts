export type Parts = any[]

const compact = (p: any) => !!p

const indent = (p: string) => "  " + p

export const block = (...parts: Parts): Parts => {
  const flattened = flatten(parts)
  return flattened.length > 0 ? ["{", flattened.map(indent), "}"] : []
}

export const concatenate = (...parts: Parts) => flatten(...parts).join("\n")

export const line = (...parts: Parts) => flatten(...parts).join(" ")

export const flatten = (...parts: Parts): Parts =>
  parts
    .filter(compact)
    .map((p) => (Array.isArray(p) ? flatten(...p) : p))
    .flat()

export const comment = (...parts: Parts) => line("/*", ...parts, "*/")

export const statement = (...parts: Parts) => line(...parts) + ";"

export const assignment = (left: string, right: string) =>
  statement(left, "=", right)

export const identifier = (...parts: Parts) =>
  parts
    .flat()
    .filter(compact)
    .join("_")
    .replace(/_{2,}/g, "_")

export const unique = (identifier: string) => (...contents: Parts): string =>
  concatenate(
    `#ifndef unique_${identifier}`,
    `#define unique_${identifier}`,
    ...contents,
    `#endif`
  )

export const sluggify = (s: string) =>
  s.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")
