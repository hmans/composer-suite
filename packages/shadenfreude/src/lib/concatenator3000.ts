export type Parts = any[]

const compact = (p: any) => !!p

const indent = (p: string) => "  " + p

export const block = (...parts: Parts): Parts => [
  "{",
  lines(parts).map(indent),
  "}"
]

export const concatenate = (...parts: Parts) => lines(...parts).join("\n")

export const lines = (...parts: Parts): string[] =>
  parts
    .filter(compact)
    .map((p) => (Array.isArray(p) ? lines(...p) : p))
    .flat()

export const statement = (...parts: Parts) =>
  parts
    .flat()
    .filter(compact)
    .join(" ") + ";"

export const assignment = (left: string, right: string) =>
  statement(left, "=", right)

export const identifier = (...parts: Parts) =>
  parts
    .flat()
    .filter(compact)
    .join("_")
    .replace(/_{2,}/g, "_")
