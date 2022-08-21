import { Input, Mul } from "shader-composer"
import { Module } from "./index"

type RotateProps = {
  rotation: Input<"mat3">
}

export const Rotate = ({ rotation }: RotateProps): Module => (state) => ({
  ...state,
  position: Mul(state.position, rotation)
})
