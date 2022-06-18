import { ReactNode } from "react"
import { Explosion } from "./Explosion"
import { Fog } from "./Fog"
import { GLTFParticles } from "./GLTFParticles"
import { Simple } from "./Simple"
import { Snow } from "./Snow"

export type ExampleDefinition = {
  path: string
  name: string
  component: ReactNode
}

export default [
  { path: "simple", name: "Simple", component: <Simple /> },
  { path: "explosion", name: "Explosion", component: <Explosion /> },
  { path: "fog", name: "Fog", component: <Fog /> },
  { path: "snow", name: "Snow", component: <Snow /> },
  { path: "gltf", name: "GLTF Particles", component: <GLTFParticles /> },
  {
    path: "combined",
    name: "Combined",
    component: (
      <>
        <Snow />
        <Fog />
        <GLTFParticles />
      </>
    )
  }
] as ExampleDefinition[]
