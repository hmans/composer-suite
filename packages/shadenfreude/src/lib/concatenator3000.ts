import sha256 from "crypto-js/sha256"
import { isExpression } from "../expressions"

export type Part = any

export type Parts = Part[]

const compact = (p: any) => !!p

const indent = (p: string) => "  " + p

const renderExpressions = (v: any) => (isExpression(v) ? v.render() : v)

export const block = (...parts: Parts): Parts => {
  const flattened = flatten(parts)
  return flattened.length > 0 ? ["{", flattened.map(indent), "}"] : []
}

export const concatenate = (...parts: Parts) => flatten(...parts).join("\n")

export const line = (...parts: Parts) => flatten(...parts).join(" ")

export const flatten = (...parts: Parts): Parts =>
  parts
    .map(renderExpressions)
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

export type Snippet = {
  _: "Snippet"
  name: string
  chunk: Part | Part[]
}

export const snippet = (render: (name: string) => Part | Parts[]): Snippet => {
  const hash = sha256(concatenate(render("")))
    .toString()
    .substring(0, 10)

  const name = identifier("snippet", hash)

  const chunk = render(name)

  return {
    _: "Snippet",
    name,
    chunk
  }
}

export function isSnippet(v: any): v is Snippet {
  return v && v._ === "Snippet"
}
