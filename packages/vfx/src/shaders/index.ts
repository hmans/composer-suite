export type Module = {
  vertexHeader: string
  vertexMain: string
  fragmentHeader: string
  fragmentMain: string
}

export const module = (input: Partial<Module>): Module => ({
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  ...input
})

export const formatValue = (value: any) =>
  typeof value === "number" ? value.toFixed(5) : value
