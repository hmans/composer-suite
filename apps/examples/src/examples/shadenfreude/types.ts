export type ShaderNode = {
  name: string
  vertex: {
    header: string
    body: string
  }
  fragment: {
    header: string
    body: string
  }
}
