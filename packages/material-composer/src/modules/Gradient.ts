import {
  Gradient as GradientUnit,
  GradientStop,
  Input,
  Mul,
  pipe,
  Smoothstep,
  VertexPosition
} from "shader-composer"
import { ModuleFactory } from ".."

/* TODO: Use new GradientStops type once SC 0.3.1+ lands */

export type GradientArgs = {
  /** The gradient, as defined by a list of vec3 gradient stops. */
  stops: GradientStop<"vec3">[]

  /** Contrast. Increase this above 1 to weigh the gradient towards its center. */
  contrast?: Input<"float">

  /** Position within the gradient. This defaults to the vertex position on the Y axis. */
  position?: Input<"float">

  /** Start of the range that the `position` value moves within. */
  start?: Input<"float">

  /** End of the range that the `position` value moves within. */
  stop?: Input<"float">
}

export const Gradient: ModuleFactory<GradientArgs> = ({
  stops,
  contrast = 1,
  start = 1,
  stop = -1,
  position = VertexPosition.y
}) => (state) => ({
  ...state,
  color: pipe(
    position,
    (v) => Mul(v, contrast),
    (v) => Smoothstep(start, stop, v),
    (v) => GradientUnit(v, ...stops)
  )
})
