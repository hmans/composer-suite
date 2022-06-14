import { ReactNode } from "react"
import { Explosion } from "./Explosion"
import { Fog } from "./Fog"
import { GLTFParticles } from "./GLTFParticles"
import { ShaderMakerTest } from "./ShaderMakerTest"
import { Simple } from "./Simple"

export type ExampleDefinition = {
  path: string
  name: string
  component: ReactNode
}

export default [
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
  },
  {
    path: "shadermaker",
    name: "ShaderMaker Test",
    component: <ShaderMakerTest />
  }
] as ExampleDefinition[]
