import idGenerator from "./idGenerator"
import objectHash from "object-hash"

export type Part = any

export type Parts = Part[]

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

export const unique = (identifier: string) => (...contents: Parts): Parts => [
  `#ifndef unique_${identifier}`,
  `#define unique_${identifier}`,
  ...contents,
  `#endif`
]

export const sluggify = (s: string) =>
  s.replace(/[^a-zA-Z0-9]/g, "_").replace(/_{2,}/g, "_")

/*** Snippets ***/

const nextSnippetId = idGenerator()

export type Snippet = {
  _: "Snippet"
  name: string
  chunk: Part | Part[]
}

export const snippet = (render: (name: string) => Part | Parts[]): Snippet => {
  const hash = objectHash(render(""))
  const name = identifier("snippet", hash)
  const chunk = unique(name)(render(name))
  return { _: "Snippet", name, chunk }
}
