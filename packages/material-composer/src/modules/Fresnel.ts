import { Fresnel as FresnelUnit, FresnelProps } from "shader-composer"
import { ModuleFactory } from ".."
import { Layer } from "../Layer"
import { Color } from "./Color"

export type FresnelArgs = FresnelProps

export const Fresnel: ModuleFactory<FresnelArgs> = (props) =>
  Layer({
    opacity: FresnelUnit(props),
    modules: [Color({ color: "white" })]
  })
