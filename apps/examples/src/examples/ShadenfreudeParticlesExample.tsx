import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  BlendNode,
  ColorNode,
  compileShader,
  CSMMasterNode,
  FresnelNode,
  MultiplyNode
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import { Emitter, MeshParticles, MeshParticlesMaterial } from "three-vfx"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useShader() {
  return useMemo(() => {
    const baseColor = ColorNode({
      color: new Color("#800")
    })

    const highlight = ColorNode({
      color: new Color(2, 2, 2)
    })

    const fresnel = MultiplyNode({
      a: highlight,
      b: FresnelNode()
    })

    const diffuseColor = BlendNode({
      a: baseColor,
      b: fresnel,
      opacity: 1
    })

    const root = CSMMasterNode({
      diffuseColor
    })

    return compileShader(root)
  }, [])
}

function ModularShaderMaterial({
  children,
  ...props
}: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()
  useFrame(update)

  // console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  return <CustomShaderMaterial {...props} {...shaderProps} />
}

export default function() {
  return (
    <group position-y={15}>
      <MeshParticles>
        <sphereGeometry args={[0.25]} />
        <MeshParticlesMaterial baseMaterial={MeshStandardMaterial} />

        <Emitter count={1} />
      </MeshParticles>
    </group>
  )
}
