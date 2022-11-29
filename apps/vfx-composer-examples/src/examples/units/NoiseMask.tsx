import { pipe } from "fp-ts/function"
import {
  Add,
  Div,
  GlobalTime,
  Input,
  Mul,
  Negate,
  NormalizePlusMinusOne,
  OneMinus,
  Saturate,
  ScaleAndOffset,
  Smoothstep,
  Sub,
  UV
} from "shader-composer"
import { PSRDNoise2D } from "shader-composer-toybox"

/* TODO: extract this into SC or SC-toybox or similar? */

export const NoiseMask = (
  threshold: Input<"float"> = 0.5,
  fringe: Input<"float"> = 0.5,
  time: Input<"float"> = GlobalTime
) => {
  const noise = NormalizePlusMinusOne(
    PSRDNoise2D(ScaleAndOffset(UV, [8, 8], [0, Negate(time)]))
  )

  return pipe(
    Smoothstep(
      Sub(threshold, Div(fringe, 2)),
      Add(threshold, Div(fringe, 2)),
      OneMinus(UV.y)
    ),
    (v) => Sub(v, Mul(noise, threshold)),
    Saturate
  )
}
