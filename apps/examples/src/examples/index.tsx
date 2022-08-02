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
import { Stress } from "./Stress"
import { Vanilla } from "./Vanilla"

export type ExampleDefinition = {
  path: string
  name: string
  component: ReactNode
}

export default [
  { path: "simple", name: "Simple", component: <Simple /> },
  { path: "vanilla", name: "Vanilla", component: <Vanilla /> },
  { path: "stress", name: "Stress", component: <Stress /> },
  { path: "firefly", name: "Firefly", component: <FireflyExample /> },
  { path: "explosion", name: "Explosion (Legacy)", component: <Explosion /> },
  { path: "fog", name: "Fog (Legacy)", component: <Fog /> },
  { path: "snow", name: "Snow (Legacy)", component: <Snow intensity={500} /> },
  { path: "dust", name: "Dust (Legacy)", component: <DustExample /> },
  {
    path: "fuzzyblob",
    name: "Fuzzy Blob (Legacy)",
    component: <FuzzyBlobExample />
  },
  {
    path: "softparticles",
    name: "Soft Particles (Legacy)",
    component: <SoftParticlesExample />
  },
  {
    path: "gltf",
    name: "GLTF Particles (Legacy)",
    component: <GLTFParticles />
  },
  {
    path: "combined",
    name: "Combined (Legacy)",
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
