import {
  Camera,
  Color,
  Matrix3,
  Matrix4,
  Scene,
  Texture,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer
} from "three"
import { $, Expression } from "./expressions"
import { identifier } from "./util/concatenator3000"

export type Program = "vertex" | "fragment"

/**
 * Currently supported GLSLTypes. Probably incomplete!
 */
export type GLSLType =
  | "bool"
  | "int"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"
  | "sampler2D"

export type JSTypes = {
  bool: boolean
  float: number
  int: number
  vec2: Vector2
  vec3: Vector3 | Color
  vec4: Vector4
  mat3: Matrix3
  mat4: Matrix4
  sampler2D: Texture
}

export type Input<T extends GLSLType = any> = Expression | JSTypes[T] | Unit<T>

export type UpdateCallback = (
  dt: number,
  camera: Camera,
  scene: Scene,
  gl: WebGLRenderer
) => void

export type UnitConfig<T extends GLSLType> = {
  /**
   * Human-readable name of this unit.
   */
  name: string

  /**
   * Machine-readable name of the global variable for this unit.
   * Will be recreated by the compiler, so no need to set this yourself.
   */
  variableName: string

  /**
   * The GLSL type of this unit.
   */
  type: T

  /**
   * The value of this unit. Can be a reference to another unit,
   * a JavaScript type that matches this unit's GLSL type, or
   * an Expression.
   */
  value: Input<T> | undefined

  /**
   * If this is set to "vertex" or "fragment", the compiler will
   * only ever render this node in the specified program. If you
   * have units referencing gl_* variables that only exist in one
   * of the programs, use this to make sure they never appear
   * in the other program (which would lead to compilation failure.)
   */
  only?: Program

  /**
   * When set to true, this variable will automatically declare a varying,
   * calculate/source its value in the vertex program only, and pass the
   * result to the fragment program through that varying. Default: false.
   */
  varying: boolean

  /**
   * An optional uniform object. It will automatically be
   * declared in the program headers, and also made available in the
   * object returned by `compilerShader`.
   */
  uniform?: { value: JSTypes[T] }
  uniformName?: string

  /**
   * A callback that will be executed once per frame.
   */
  update?: UpdateCallback

  /**
   * A callback that will be executed when the shader is being disposed.
   */
  dispose?: () => void

  /* Chunks */
  vertex?: {
    header?: Expression
    body?: Expression
  }

  fragment?: {
    header?: Expression
    body?: Expression
  }
}

export type UnitAPI<T extends GLSLType> = T extends "vec2"
  ? {
      readonly x: Unit<"float">
      readonly y: Unit<"float">
    }
  : T extends "vec3"
  ? {
      readonly x: Unit<"float">
      readonly y: Unit<"float">
      readonly z: Unit<"float">
    }
  : T extends "vec4"
  ? {
      readonly x: Unit<"float">
      readonly y: Unit<"float">
      readonly z: Unit<"float">
      readonly w: Unit<"float">
    }
  : API

const unitAPI = <T extends GLSLType>(unit: IUnit<T>): UnitAPI<T> => {
  if (isUnitOfType(unit, "vec2")) {
    return {
      get x() {
        return Unit("float", $`${unit}.x`)
      },
      get y() {
        return Unit("float", $`${unit}.y`)
      }
    } as UnitAPI<T>
  }

  if (isUnitOfType(unit, "vec3")) {
    return {
      get x() {
        return Unit("float", $`${unit}.x`)
      },
      get y() {
        return Unit("float", $`${unit}.y`)
      },
      get z() {
        return Unit("float", $`${unit}.z`)
      }
    } as UnitAPI<T>
  }

  if (isUnitOfType(unit, "vec4")) {
    return {
      get x() {
        return Unit("float", $`${unit}.x`)
      },
      get y() {
        return Unit("float", $`${unit}.y`)
      },
      get z() {
        return Unit("float", $`${unit}.z`)
      },
      get w() {
        return Unit("float", $`${unit}.w`)
      }
    } as UnitAPI<T>
  }

  return {} as UnitAPI<T>
}

export interface IUnit<T extends GLSLType = GLSLType> {
  _: "Unit"
  _unitConfig: UnitConfig<T>
}

export type Unit<T extends GLSLType = GLSLType> = IUnit<T> & UnitAPI<T>

export const Unit = <T extends GLSLType>(
  type: T,
  value: Input<T> | undefined,
  _config?: Partial<UnitConfig<T>>
): Unit<T> => {
  const config: UnitConfig<T> = {
    name: "Anonymous",
    type,
    value,
    varying: false,
    variableName: identifier("var", Math.floor(Math.random() * 1000000)),
    ..._config
  }

  const unit: IUnit<T> = {
    _: "Unit",
    _unitConfig: config
  }

  return injectAPI(unit, unitAPI)
}

export function isUnit(value: any): value is Unit {
  return value && value._ === "Unit"
}

function isUnitOfType<T extends GLSLType>(value: any, type: T): value is Unit<T> {
  return isUnit(value) && value._unitConfig.type === type
}

export const isUnitInProgram = (unit: Unit, program: Program) =>
  [undefined, program].includes(unit._unitConfig.only)

export const uniformName = (unit: Unit) =>
  unit._unitConfig.uniformName ?? `u_${unit._unitConfig.variableName}`

export type API = Record<string, any>
export type APIFactory<U extends IUnit, A extends API> = (unit: U) => A

/**
 * Given a unit and an API factory function, pass the unit to the factory
 * function and inject its return value into the unit (as to not break
 * object references.)
 */
export const injectAPI = <U extends IUnit, A extends API>(
  unit: U,
  factory: APIFactory<U, A>
) => {
  const api = factory(unit)
  return Object.defineProperties(unit, Object.getOwnPropertyDescriptors(api)) as U & A
}
