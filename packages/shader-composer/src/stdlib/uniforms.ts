import { PerspectiveCamera, Vector2 } from "three"
import { $ } from "../expressions"
import { GLSLType, injectAPI, JSTypes, uniformName, Unit, UnitConfig } from "../units"
import { FragmentCoordinate } from "./globals"
import { Vec2 } from "./values"

export type UniformUnit<T extends GLSLType, J extends JSTypes[T] = JSTypes[T]> = Unit<
  T
> & {
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

export const Time = (initial: number = 0) => {
  const uniform = UniformUnit("float", initial, {
    name: "Time Uniform",

    update: (dt) => {
      uniform.value += dt
    }
  })

  return uniform
}

export const Resolution = UniformUnit("vec2", new Vector2(0, 0), {
  name: "Current Render Resolution",

  update: (dt, camera, scene, gl) => {
    Resolution.value.x = gl.domElement.width
    Resolution.value.y = gl.domElement.height
  }
})

export const CameraNear = UniformUnit("float", 0 as number, {
  name: "Camera Near Plane",

  update: (_, camera) => {
    if (camera instanceof PerspectiveCamera) {
      CameraNear.value = camera.near
    }
  }
})

export const CameraFar = UniformUnit("float", 0 as number, {
  name: "Camera Far Plane",

  update: (_, camera) => {
    if (camera instanceof PerspectiveCamera) {
      CameraFar.value = camera.far
    }
  }
})

export const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`, {
  name: "Screen UV"
})
