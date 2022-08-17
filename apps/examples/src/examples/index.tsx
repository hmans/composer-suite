import { lazy } from "react"

const examples = {
  simple: { title: "Simple", Example: lazy(() => import("./Simple")) }
  // { path: "vanilla", name: "Vanilla", component: <Vanilla /> },
  // { path: "stress", name: "Stress", component: <Stress /> },
  // { path: "firefly", name: "Firefly", component: <FireflyExample /> },
  // {
  //   path: "softparticles",
  //   name: "Soft Particles",
  //   component: <SoftParticlesExample />
  // },
  // { path: "fog", name: "Fog", component: <Fog /> },
  // { path: "bubbles", name: "Bubbles", component: <Bubbles /> },
}

export default examples
