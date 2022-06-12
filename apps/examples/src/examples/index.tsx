import { ReactNode } from "react"
import { Composable } from "./Composable"
import { Explosion } from "./Explosion"
import { Fog } from "./Fog"
import { GLTFParticles } from "./GLTFParticles"
import { Simple } from "./Simple"

export type ExampleDefinition = {
  path: string
  name: string
  component: ReactNode
}

export default [
  { path: "composable", name: "Composable", component: <Composable /> },
  { path: "simple", name: "Simple", component: <Simple /> },
  { path: "explosion", name: "Explosion", component: <Explosion /> },
  { path: "fog", name: "Fog", component: <Fog /> },
  { path: "gltf", name: "GLTF Particles", component: <GLTFParticles /> },
  {
    path: "combined",
    name: "Combined",
    component: (
      <>
        <Fog />
        <GLTFParticles />
      </>
    )
  }
] as ExampleDefinition[]
