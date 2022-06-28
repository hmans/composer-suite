import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import {
  AddNode,
  AttributeNode,
  ColorNode,
  compileShader,
  CSMMasterNode,
  float,
  GLSLType,
  glslType,
  mat4,
  MultiplyNode,
  nodeFactory,
  TimeNode,
  Value,
  variable,
  vec2,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, DepthTexture, Vector3 } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

export type ParticlesMaterial = CustomShaderMaterialImpl & {
  __vfx: {
    /* TODO */
  }
}

export type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
  softnessFunction?: string
  depthTexture?: DepthTexture
}

const ParticleAgeNode = nodeFactory<{
  time: Value<"float">
  startTime: Value<"float">
  endTime: Value<"float">
}>(({ time, startTime, endTime }) => ({
  inputs: {
    time: float(time),
    startTime: float(startTime),
    endTime: float(endTime)
  },
  outputs: {
    age: float(`time - startTime`),
    value: float(`age / (endTime - startTime)`)
  },
  fragment: {
    body: `if (value < 0.0 || value > 1.0) { discard; }`
  }
}))

const StatelessVelocityNode = nodeFactory<{
  time: Value<"float">
  velocity: Value<"vec3">
}>(({ time, velocity }) => ({
  inputs: {
    time: float(time),
    velocity: vec3(velocity)
  },
  outputs: {
    value: vec3()
  },
  vertex: {
    body: "value = velocity * time * mat3(instanceMatrix);"
  }
}))

const VaryingNode = nodeFactory<{ type: GLSLType; source: Value }>(
  ({ type, source }) => ({
    name: "Varying",
    varyings: {
      v_value: variable(type)
    },
    inputs: {
      source: variable(type)
    },
    outputs: {
      value: variable(type)
    },
    vertex: {
      body: `v_value = ${source};`
    },
    fragment: {
      body: "value = v_value;"
    }
  })
)

const InstanceMatrixNode = nodeFactory(() => ({
  name: "Instance Matrix",
  inputs: {
    v_value: mat4(VaryingNode({ type: "mat4", source: "instanceMatrix" }))
  },
  outputs: {
    value: mat4("v_value")
  }
}))

const StatelessAccelerationNode = nodeFactory<{
  time: Value<"float">
  acceleration: Value<"vec3">
}>(({ time, acceleration }) => ({
  inputs: {
    time: float(time),
    acceleration: vec3(acceleration),
    instanceMatrix: mat4(InstanceMatrixNode())
  },
  outputs: {
    value: vec3(`0.5 * time * time * acceleration`)
  }
}))

const LifetimeAttributeNode = nodeFactory(() => ({
  inputs: {
    data: vec2(AttributeNode({ name: "lifetime", type: "vec2" }))
  },
  outputs: {
    startTime: float("data.x"),
    endTime: float("data.y")
  }
}))

export const ParticlesMaterial = forwardRef<
  ParticlesMaterial,
  ParticlesMaterialProps
>(
  (
    {
      billboard = false,
      softness = 0,
      scaleFunction,
      colorFunction,
      softnessFunction,
      depthTexture,
      ...props
    },
    ref
  ) => {
    const material = useRef<ParticlesMaterial>(null!)

    const shader = useMemo(() => {
      const time = TimeNode()
      const lifetimeAttribute = LifetimeAttributeNode()
      const lifetime = ParticleAgeNode({
        time,
        startTime: lifetimeAttribute.outputs.startTime,
        endTime: lifetimeAttribute.outputs.endTime
      })

      const movement = AddNode({
        a: StatelessVelocityNode({
          time: lifetime.outputs.age,
          velocity: new Vector3(0, 0, 0)
        }),
        b: StatelessAccelerationNode({
          time: lifetime.outputs.age,
          acceleration: new Vector3(0, -10, 0)
        })
      })

      const position = AddNode({
        a: VertexPositionNode(),
        b: movement
      })

      const diffuseColor = MultiplyNode({
        a: ColorNode({ color: new Color("#fff") }),
        b: lifetime
      })

      const root = CSMMasterNode({
        position,
        diffuseColor
      })

      return compileShader(root)

      // const layers = [
      //   provideTime(),
      //   provideLifetime(),
      //   provideResolution(),
      //   provideEasingFunctions(),
      //   softness && provideDepthTexture(depthTexture!),
      //   billboard && billboarding(),
      //   animateScale(scaleFunction),
      //   animateMovement(),
      //   animateColors(colorFunction),
      //   softness && softParticles(softness, softnessFunction)
      // ].filter((l) => l) as Shader[]

      // return combineShaders(layers)
    }, [])

    const { update, ...attrs } = shader

    useLayoutEffect(() => {
      material.current.__vfx = { shader }
    }, [])

    useFrame(update)

    return (
      <CustomShaderMaterial
        ref={mergeRefs([material, ref])}
        {...attrs}
        {...props}
      />
    )
  }
)
