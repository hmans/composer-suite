import { Vector2 } from "three"
import { $, Expression } from "../expressions"
import { GLSLType, injectAPI, JSTypes, Unit, UnitConfig } from "../units"
import { $localToViewSpace, $localToWorldSpace } from "./spaces"
import { Bool, Int, Mat4, Vec2, Vec3 } from "./values"

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
 */
export const InstanceID = Int($`gl_InstanceID`, {
  name: "Instance ID",
  varying: "flat"
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

export const CameraPosition = Vec3($`cameraPosition`, {
  name: "Camera Position"
})

export const ViewMatrix = Mat4($`viewMatrix`, {
  name: "View Matrix"
})

export const ModelMatrix = Mat4($`modelMatrix`, {
  name: "Model Matrix"
})

export const ModelViewMatrix = Mat4($`modelViewMatrix`, {
  name: "ModelView Matrix"
})

export const NormalMatrix = Mat4($`normalMatrix`, {
  name: "Normal Matrix"
})

export const ProjectionMatrix = Mat4($`projectionMatrix`, {
  name: "Projection Matrix"
})

/**
 * Returns true if instanced rendering is enabled, false if it is not.
 */
export const UsingInstancing = Bool($`
  #ifdef USE_INSTANCING
    true
  #else
    false
  #endif
`)

/**
 * Returns the instance matrix. Please note that this is only available when
 * instanced rendering is enabled.
 */
export const InstanceMatrix = Mat4($`instanceMatrix`, {
  name: "Instance Matrix",
  only: "vertex"
})

export const UV = Vec2($`uv`, {
  name: "UV",
  varying: true
})

const Vec3WithSpaceConversions = (expr: Expression, name: string) =>
  injectAPI(Vec3(expr, { name, varying: true }), (unit) => ({
    get world() {
      return Vec3($localToWorldSpace(unit), {
        varying: true,
        name: `${name} (World Space)`
      })
    },

    get view() {
      return Vec3($localToViewSpace(unit), {
        varying: true,
        name: `${name} (View Space)`
      })
    }
  }))

export const VertexPosition = Vec3WithSpaceConversions(
  $`position`,
  "Vertex Position"
)
export const VertexNormal = Vec3WithSpaceConversions($`normal`, "Vertex Normal")

export const ViewDirection = Vec3(
  $`vec3(-${ViewMatrix}[0][2], -${ViewMatrix}[1][2], -${ViewMatrix}[2][2])`,
  { varying: true, name: "View Direction" }
)

export const IsFrontFacing = Bool($`gl_FrontFacing`, { only: "fragment" })

export const Attribute = <T extends GLSLType>(type: T, name: string) =>
  Unit(type, $`${name}`, {
    name: `Attribute: ${name}`,
    varying: true,
    vertex: {
      header: $`attribute ${type} ${name};`
    }
  })

export type UniformUnit<
  T extends GLSLType,
  J extends JSTypes[T] = JSTypes[T]
> = Unit<T> & {
  value: J
}

export const UniformUnit = <T extends GLSLType, J extends JSTypes[T]>(
  type: T,
  initialValue: J,
  extras?: Partial<UnitConfig<T>>
): UniformUnit<T, J> => {
  const uniform = { value: initialValue }

  /* Create the actual unit that represents the uniform. */
  const unit = Unit(type, undefined, {
    name: `Uniform (${type})`,
    ...extras,
    uniform
  })

  /* Return the unit with some API bits mixed in. */
  return injectAPI(unit, () => ({
    set value(v: J) {
      uniform.value = v
    },

    get value(): J {
      return uniform.value
    }
  }))
}

/**
 * Provides a uniform unit holding a representation of time. The time value
 * stored is not an absolute time, so multiple instances of this unit will not
 * be synchronized. If you require synchronization, please either reuse the
 * same instance of this unit, or use `GlobalTime` instead.
 *
 * @param initial The initial time value to start with. (Default: 0)
 */
export const Time = (initial: number = 0) => {
  const uniform = UniformUnit("float", initial, {
    name: "Time Uniform",

    update: (dt) => {
      uniform.value += dt
    }
  })

  return uniform
}

/**
 * A global time uniform unit that can be safely used across multiple shaders,
 * wherever synchronization is required,
 * and as a default value for `time` inputs of other unit implementations, to prevent
 * shaders from being spammed by multiple uniforms all holding different
 * representations of time.
 */
export const GlobalTime = Time()

export const Resolution = UniformUnit("vec2", new Vector2(0, 0), {
  name: "Current Render Resolution",

  update: () => {
    "Please customize the Resolution unit with the relevant code for your environment."
  }
})

export const CameraNear = UniformUnit("float", 0 as number, {
  name: "Camera Near Plane",

  update: () => {
    console.warn(
      "Please customize the CameraNear unit with the relevant code for your environment."
    )
  }
})

export const CameraFar = UniformUnit("float", 0 as number, {
  name: "Camera Far Plane",

  update: () => {
    console.warn(
      "Please customize the CameraNear unit with the relevant code for your environment."
    )
  }
})

export const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`, {
  name: "Screen UV"
})
