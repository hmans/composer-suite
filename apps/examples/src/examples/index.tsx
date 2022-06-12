import { ReactNode } from "react"
import { ComposableVanilla } from "./ComposableVanilla"
import { ComposableFiber } from "./ComposableFiber"
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
    path: "composable_vanilla",
    name: "Composable (Vanilla)",
    component: <ComposableVanilla />
  },
  {
    path: "composable_fiber",
    name: "Composable (Fiber)",
    component: <ComposableFiber />
  }
] as ExampleDefinition[]
