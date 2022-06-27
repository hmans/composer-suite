import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import {
  AddNode,
  BlendNode,
  ColorNode,
  compileShader,
  CSMMasterNode,
  float,
  FresnelNode,
  MultiplyNode,
  node,
  nodeFactory,
  TimeNode,
  Value,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, DepthTexture, Vector3 } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

export type MeshParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
  softnessFunction?: string
  depthTexture?: DepthTexture
}

export type MeshParticlesMaterial = CustomShaderMaterialImpl & {
  __vfx: {
    shader: Shader
  }
}

export const MeshParticlesMaterial = forwardRef<
  MeshParticlesMaterial,
  MeshParticlesMaterialProps
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
    const material = useRef<MeshParticlesMaterial>(null!)

    const shader = useMemo(() => {
      const time = TimeNode()

      const StatelessVelocityNode = nodeFactory<{
        time: Value<"float">
        velocity: Value<"vec3">
      }>(({ time, velocity }) => ({
        inputs: {
          time: float(time),
          velocity: vec3(velocity)
        },
        outputs: {
          value: vec3(`time * velocity`)
        }
      }))

      const StatelessAccelerationNode = nodeFactory<{
        time: Value<"float">
        acceleration: Value<"vec3">
      }>(({ time, acceleration }) => ({
        inputs: {
          time: float(time),
          acceleration: vec3(acceleration)
        },
        outputs: {
          value: vec3(`0.5 * time * time * acceleration;`)
        }
      }))

      const LifetimeNode = nodeFactory<{
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

      const lifetime = LifetimeNode({ time, startTime: 0, endTime: 1 })

      const movement = AddNode({
        a: StatelessVelocityNode({
          time: lifetime,
          velocity: new Vector3(0, 0, 0)
        }),
        b: StatelessAccelerationNode({
          time: lifetime,
          acceleration: new Vector3(0, -10, 0)
        })
      })

      const position = AddNode({
        a: VertexPositionNode(),
        b: movement
      })

      const root = CSMMasterNode({
        position
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
