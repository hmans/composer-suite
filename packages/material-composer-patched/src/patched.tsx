import { Constructor } from "@hmans/types"
import {
  PatchedMaterialOptions,
  patchMaterial
} from "@material-composer/patch-material"
import { MaterialNode, Node } from "@react-three/fiber"
import React, { forwardRef, useImperativeHandle, useLayoutEffect } from "react"
import * as THREE from "three"
import { useManagedPrimitive } from "./lib/useManagedInstance"

export type ShaderProps = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: Record<string, THREE.IUniform<any>>
}

export type PatchedMaterialProps<C extends Constructor<THREE.Material>> =
  MaterialNode<InstanceType<C>, C> & ShaderProps

export const makePatchedMaterialComponent = <
  C extends Constructor<M>,
  M extends THREE.Material
>(
  ctor: C
) =>
  forwardRef<M, PatchedMaterialProps<C>>(
    ({ args = [], vertexShader, fragmentShader, uniforms, ...props }, ref) => {
      /* Create a new material instance any time the shader-related props change. */
      const material = useManagedPrimitive(
        () => new ctor(...(args as any)),
        [vertexShader, fragmentShader, uniforms]
      )

      /* Patch newly created materials */
      useLayoutEffect(() => {
        patchMaterial(material, {
          vertexShader,
          fragmentShader,
          uniforms
        })
      }, [material])

      return <primitive object={material} ref={ref} {...props} />
    }
  )

type MaterialInstanceProps<M extends THREE.Material> = {
  instance: M
} & Node<M, any> &
  PatchedMaterialOptions

function Material<M extends THREE.Material>(
  {
    instance,
    vertexShader,
    fragmentShader,
    uniforms,
    ...props
  }: MaterialInstanceProps<M>,
  ref: React.Ref<M>
) {
  useLayoutEffect(() => {
    patchMaterial(instance, { vertexShader, fragmentShader, uniforms })
  }, [instance, vertexShader, fragmentShader, uniforms])

  useImperativeHandle(ref, () => instance)

  return <primitive object={instance} {...props} />
}

/* Here's our fake proxy. We'll eventually replace it with a real proxy! */
export const Patched = {
  LineBasicMaterial: makePatchedMaterialComponent(THREE.LineBasicMaterial),
  LineDashedMaterial: makePatchedMaterialComponent(THREE.LineDashedMaterial),
  MeshBasicMaterial: makePatchedMaterialComponent(THREE.MeshBasicMaterial),
  MeshDepthMaterial: makePatchedMaterialComponent(THREE.MeshDepthMaterial),
  MeshDistanceMaterial: makePatchedMaterialComponent(
    THREE.MeshDistanceMaterial
  ),
  MeshLambertMaterial: makePatchedMaterialComponent(THREE.MeshLambertMaterial),
  MeshMatcapMaterial: makePatchedMaterialComponent(THREE.MeshMatcapMaterial),
  MeshNormalMaterial: makePatchedMaterialComponent(THREE.MeshNormalMaterial),
  MeshPhongMaterial: makePatchedMaterialComponent(THREE.MeshPhongMaterial),
  MeshPhysicalMaterial: makePatchedMaterialComponent(
    THREE.MeshPhysicalMaterial
  ),
  MeshStandardMaterial: makePatchedMaterialComponent(
    THREE.MeshStandardMaterial
  ),
  MeshToonMaterial: makePatchedMaterialComponent(THREE.MeshToonMaterial),
  PointsMaterial: makePatchedMaterialComponent(THREE.PointsMaterial),
  ShadowMaterial: makePatchedMaterialComponent(THREE.ShadowMaterial),
  SpriteMaterial: makePatchedMaterialComponent(THREE.SpriteMaterial),

  /**
   * Use `patched.Material` when you already have an instance of a material
   * that you want to patch (eg. a material loded from a GLTF, or one that uses
   * a custom material class.)
   *
   * @example
   * ```jsx
   * <patched.Material instance={myMaterial} {...shader} />
   * ```
   */
  Material: forwardRef(Material),

  /*
  LEGACY API
  TODO: REMOVE in future version
  */
  lineBasicMaterial: makePatchedMaterialComponent(THREE.LineBasicMaterial),
  lineDashedMaterial: makePatchedMaterialComponent(THREE.LineDashedMaterial),
  meshBasicMaterial: makePatchedMaterialComponent(THREE.MeshBasicMaterial),
  meshDepthMaterial: makePatchedMaterialComponent(THREE.MeshDepthMaterial),
  meshDistanceMaterial: makePatchedMaterialComponent(
    THREE.MeshDistanceMaterial
  ),
  meshLambertMaterial: makePatchedMaterialComponent(THREE.MeshLambertMaterial),
  meshMatcapMaterial: makePatchedMaterialComponent(THREE.MeshMatcapMaterial),
  meshNormalMaterial: makePatchedMaterialComponent(THREE.MeshNormalMaterial),
  meshPhongMaterial: makePatchedMaterialComponent(THREE.MeshPhongMaterial),
  meshPhysicalMaterial: makePatchedMaterialComponent(
    THREE.MeshPhysicalMaterial
  ),
  meshStandardMaterial: makePatchedMaterialComponent(
    THREE.MeshStandardMaterial
  ),
  meshToonMaterial: makePatchedMaterialComponent(THREE.MeshToonMaterial),
  pointsMaterial: makePatchedMaterialComponent(THREE.PointsMaterial),
  shadowMaterial: makePatchedMaterialComponent(THREE.ShadowMaterial),
  spriteMaterial: makePatchedMaterialComponent(THREE.SpriteMaterial),

  /**
   * Use `patched.Material` when you already have an instance of a material
   * that you want to patch (eg. a material loded from a GLTF, or one that uses
   * a custom material class.)
   *
   * @example
   * ```jsx
   * <patched.Material instance={myMaterial} {...shader} />
   * ```
   */
  material: forwardRef(Material)
} as const
