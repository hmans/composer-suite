import { ReactNode } from "react"
import { DustExample } from "./DustExample"
import { Explosion } from "./Explosion"
import { FireflyExample } from "./FireflyExample"
import { Fog } from "./Fog"
import { FuzzyBlobExample } from "./FuzzyBlobExample"
import { GLTFParticles } from "./GLTFParticles"
import Playground from "./Playground"
import { Simple } from "./Simple"
import { Snow } from "./Snow"
import { SoftParticlesExample } from "./SoftParticlesExample"

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
  { path: "fuzzyblob", name: "Fuzzy Blob", component: <FuzzyBlobExample /> },
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
  },
  { path: "playground", name: "Playground", component: <Playground /> }
] as ExampleDefinition[]
