import { $ } from "../expressions"
import { Input } from "../units"
import {
  rotation3d,
  rotation3dX,
  rotation3dY,
  rotation3dZ
} from "../vendor/glsl-rotate"
import { Mul } from "./math"
import { $mat3, Mat3, Mat4 } from "./values"

/**
 * Generates a Shader Unit of type `mat4` representing a rotation around a specified
 * axis, by a specified amount/angle. This unit can then be multiplied with a
 * `vec3` unit in order to apply the rotation to that vector.
 *
 * @param axis Axis to rotate around.
 * @param angle The angle (amount) to rotate.
 * @returns A Shader Unit of type `mat4` representing the rotation matrix.
 */
export const Rotation3D = (axis: Input<"vec3">, angle: Input<"float">) =>
  Mat4($`${rotation3d}(${axis}, ${angle})`)

export const Rotation3DX = (angle: Input<"float">) =>
  Mat3($`${rotation3dX}(${angle})`)

export const Rotation3DY = (angle: Input<"float">) =>
  Mat3($`${rotation3dY}(${angle})`)

export const Rotation3DZ = (angle: Input<"float">) =>
  Mat3($`${rotation3dZ}(${angle})`)

/**
 * Rotate a vector around the specified axis.
 *
 * @param position Vector to rotate.
 * @param axis The axis to rotate around.
 * @param angle The angle (amount) to rotate around the axis.
 * @returns A `vec3` Shader Unit containing the rotated vector.
 */
export const Rotate3D = (
  position: Input<"vec3">,
  axis: Input<"vec3">,
  angle: Input<"float">
) => Mul(position, $mat3(Rotation3D(axis, angle)))

export const RotateX = (position: Input<"vec3">, angle: Input<"float">) =>
  Mul(position, Rotation3DX(angle))

export const RotateY = (position: Input<"vec3">, angle: Input<"float">) =>
  Mul(position, Rotation3DY(angle))

export const RotateZ = (position: Input<"vec3">, angle: Input<"float">) =>
  Mul(position, Rotation3DZ(angle))
