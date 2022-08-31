import { $ } from "../expressions"
import { Int, Vec2 } from "./values"

/**
 * Returns the current fragment's on-screen coordinate.
 */
export const FragmentCoordinate = Vec2($`gl_FragCoord.xy`, {
  name: "Fragment Coordinate",
  only: "fragment"
})

/**
 * In instanced rendering, will return the instance ID.
 * Wraps the `gl_InstanceID` GLSL built-in.
 *
 * Note: available in vertex shader only!
 */
export const InstanceID = Int($`gl_InstanceID`, {
  name: "Instance ID",
  only: "vertex"
})

/**
 * Returns the verte ID.
 * Wraps the `gl_VertexID` GLSL built-in.
 *
 * Note: available in vertex shader only!
 */
export const VertexID = Int($`gl_VertexID`, {
  name: "Vertex ID",
  only: "vertex"
})
