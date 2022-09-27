import { useConst } from "@hmans/use-const"
import { patchMaterial } from "@material-composer/patch-material"
import { useInstanceHandle } from "@react-three/fiber"
import React, { useLayoutEffect, useRef } from "react"
import { Unit } from "shader-composer"
import { IUniform, Material } from "three"
import { useShader } from "./hooks"

export type ShaderProps = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, IUniform<any>>
}

export const Shader = ({
  vertexShader,
  fragmentShader,
  uniforms
}: ShaderProps) => {
  /* Hook into r3f internals to get the parent */
  const object = useConst(() => ({}))
  const ref = useRef()
  const instance = useInstanceHandle(ref)

  useLayoutEffect(() => {
    const parent = instance.current.parent as unknown
    if (!parent) throw new Error("<Shader> must be a child of a material")

    patchMaterial(parent as Material, {
      vertexShader,
      fragmentShader,
      uniforms
    })
  }, [vertexShader, fragmentShader, uniforms])

  return <primitive object={object} ref={ref} />
}
