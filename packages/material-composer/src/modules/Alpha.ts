import { Input } from "shader-composer"
import { Module } from ".."

export type AlphaArgs = { alpha: Input<"float"> }

export const Alpha = ({ alpha }: AlphaArgs): Module => (state) => ({
  ...state,
  alpha
})
