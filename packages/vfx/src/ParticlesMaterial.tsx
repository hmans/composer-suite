import { useFBO } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useEffect, useMemo, useRef } from "react"
import mergeRefs from "react-merge-refs"
import {
  AddEquation,
  CustomBlending,
  DepthFormat,
  DepthTexture,
  FloatType
} from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { createShader } from "./shaders/shader"

function useDepthBuffer() {
  const dpr = useThree((state) => state.viewport.dpr)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const w = 256
  const h = 256

  const depthConfig = useMemo(() => {
    const depthTexture = new DepthTexture(w, h)
    depthTexture.format = DepthFormat
    depthTexture.type = FloatType

    return { depthTexture }
  }, [width, height])

  const depthFBO = useFBO(w, h, depthConfig)

  useFrame((state) => {
    state.gl.setRenderTarget(depthFBO)
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return depthFBO.depthTexture
}

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
  softness?: number
  scaleFunction?: string
  colorFunction?: string
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(
  (
    { billboard = false, softness = 0, scaleFunction, colorFunction, ...props },
    ref
  ) => {
    const material = useRef<CustomShaderMaterialImpl>(null!)

    const { width, height } = useThree((state) => state.size)

    const shader = useMemo(
      () =>
        createShader({
          billboard,
          softness,
          scaleFunction,
          colorFunction
        }),
      []
    )

    if (softness) {
      const { camera } = useThree()

      const depthBuffer = useDepthBuffer()

      useEffect(() => {
        material.current.uniforms.u_depth.value = depthBuffer
        material.current.uniforms.u_cameraNear.value = camera.near
        material.current.uniforms.u_cameraFar.value = camera.far
        material.current.uniforms.u_resolution.value = [
          window.innerWidth,
          window.innerHeight
        ]
      }, [depthBuffer, width, height])
    }

    return (
      <CustomShaderMaterial
        ref={mergeRefs([material, ref])}
        blending={CustomBlending}
        blendEquation={AddEquation}
        depthTest={true}
        depthWrite={false}
        {...shader}
        {...props}
      />
    )
  }
)
