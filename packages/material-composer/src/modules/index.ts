import { Module } from ".."

export * from "./Acceleration"
export * from "./Alpha"
export * from "./Billboard"
export * from "./Color"
export * from "./Fresnel"
export * from "./Gradient"
export * from "./Lifetime"
export * from "./Rotate"
export * from "./Scale"
export * from "./Softness"
export * from "./SurfaceWobble"
export * from "./Texture"
export * from "./Translate"
export * from "./Velocity"

export const CustomModule = ({ module }: { module: Module }): Module => module
