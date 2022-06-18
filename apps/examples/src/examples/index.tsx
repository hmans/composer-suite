import { ReactNode } from "react"
import { DustExample } from "./DustExample"
import { Explosion } from "./Explosion"
import { FireflyExample } from "./FireflyExample"
import { Fog } from "./Fog"
import { GLTFParticles } from "./GLTFParticles"
import { Simple } from "./Simple"
import { Snow } from "./Snow"
import { SoftParticlesExample } from "./SoftParticlesExample"
import { TornadoExample } from "./TornadoExample"

export type ExampleDefinition = {
  path: string
  name: string
  component: ReactNode
}

export default [
  { path: "simple", name: "Simple", component: <Simple /> },
  { path: "explosion", name: "Explosion", component: <Explosion /> },
  { path: "firefly", name: "Firefly", component: <FireflyExample /> },
  { path: "fog", name: "Fog", component: <Fog /> },
  { path: "snow", name: "Snow", component: <Snow intensity={500} /> },
  { path: "dust", name: "Dust", component: <DustExample /> },
  { path: "tornado", name: "Tornado (WIP)", component: <TornadoExample /> },
  {
    path: "softparticles",
    name: "Soft Particles",
    component: <SoftParticlesExample />
  },
  { path: "gltf", name: "GLTF Particles", component: <GLTFParticles /> },
  {
    path: "combined",
    name: "Combined",
    component: (
      <>
        <Fog />
        <GLTFParticles />
        <DustExample />
      </>
    )
  }
] as ExampleDefinition[]
