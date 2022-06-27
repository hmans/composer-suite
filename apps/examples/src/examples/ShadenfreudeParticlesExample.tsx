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
import { iCSMProps } from "three-custom-shader-material"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat
} from "three-vfx"

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

export default function() {
  return (
    <group position-y={15}>
      <MeshParticles>
        <sphereGeometry args={[0.25]} />
        <MeshParticlesMaterial baseMaterial={MeshStandardMaterial} />

        <Repeat interval={0.2}>
          <Emitter count={1} />
        </Repeat>
      </MeshParticles>
    </group>
  )
}
