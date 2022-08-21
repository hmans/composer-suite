import { Add, Input, InstanceMatrix, mat3, Mul, pipe } from "shader-composer"
import { Module } from "./index"

type TranslateProps = {
  offset: Input<"vec3">
}

export const Translate = ({ offset }: TranslateProps): Module => (state) => ({
  ...state,
  position: pipe(
    offset,
    (v) => Mul(v, mat3(InstanceMatrix)),
    (v) => Add(state.position, v)
  )
})
