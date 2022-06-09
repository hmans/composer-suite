import { ReactNode } from "react"
import { Explosion } from "./Explosion"
import { Fog } from "./Fog"
import { Simple } from "./Simple"

export type ExampleDefinition = {
  path: string
  name: string
  component: ReactNode
}

export default [
  { path: "simple", name: "Simple", component: <Simple /> },
  { path: "explosion", name: "Explosion", component: <Explosion /> },
  { path: "fog", name: "Fog", component: <Fog /> }
] as ExampleDefinition[]
