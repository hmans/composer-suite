import { GLSLType, Input, Unit, UnitConfig } from "../units"

const makeUnitFactory = <T extends GLSLType>(type: T) => (
  v: Input<T>,
  extras?: Partial<UnitConfig<T>>
) => Unit(type, v, extras) as Unit<T>

export const Float = makeUnitFactory("float")
export const Int = makeUnitFactory("int")
export const Bool = makeUnitFactory("bool")
export const Vec2 = makeUnitFactory("vec2")
export const Vec3 = makeUnitFactory("vec3")
export const Vec4 = makeUnitFactory("vec4")
export const Mat3 = makeUnitFactory("mat3")
export const Mat4 = makeUnitFactory("mat4")

export const Master = (extras?: Partial<UnitConfig<"bool">>) => Bool(true, extras)
