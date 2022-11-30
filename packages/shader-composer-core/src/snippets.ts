import { Expression } from "./expressions"

export type Snippet = {
  _: "Snippet"
  name: string
  render: (name: string) => Expression
  expression: Expression
}

export const Snippet = (render: (name: string) => Expression): Snippet => {
  /* Start with a randomized name. The compiler will assign a deterministic name in its prepare step. */
  const name = `uninitialized_snippet_${Math.floor(Math.random() * 1000000)}`

  return {
    _: "Snippet",
    name,
    render,
    expression: render(name)
  }
}

export const renameSnippet = (snippet: Snippet, name: string) => {
  snippet.name = name
  snippet.expression = snippet.render(name)
}

export function isSnippet(x: any): x is Snippet {
  return x && x._ === "Snippet"
}
