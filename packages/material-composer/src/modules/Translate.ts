import { ModuleFactory } from "."
import { Add, Input, InstanceMatrix, mat3, Mul, pipe } from "shader-composer"

type TranslateProps = {
  offset: Input<"vec3">
}

export const Translate: ModuleFactory<TranslateProps> = ({ offset }) => (
  state
) => ({
  ...state,
  position: pipe(
    offset,
    (v) => Mul(v, mat3(InstanceMatrix)),
    (v) => Add(state.position, v)
  )
})
