import { Effects } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { useContext } from "react"
import { HalfFloatType, LinearEncoding, Vector2 } from "three"
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"
import { useControls } from "leva"

extend({ UnrealBloomPass, AdaptiveToneMappingPass, ShaderPass, RenderPass })

type EffectsPassProps<T extends { new (...args: any): any }> = {
  args?: ConstructorParameters<T>
  enabled?: boolean
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: EffectsPassProps<typeof UnrealBloomPass>
      adaptiveToneMappingPass: EffectsPassProps<typeof AdaptiveToneMappingPass>
    }
  }
}

export const RenderPipeline = () => {
  const { bloom, toneMapping, vignette } = useControls("Full-Screen Effects", {
    bloom: true,
    toneMapping: false,
    vignette: true
  })

  return (
    <Effects disableGamma encoding={LinearEncoding} type={HalfFloatType}>
      <unrealBloomPass
        args={[new Vector2(512, 512), 2, 0.05, 1]}
        enabled={bloom}
      />
      <adaptiveToneMappingPass args={[true, 256]} enabled={toneMapping} />
      <shaderPass args={[VignetteShader]} enabled={vignette} />
    </Effects>
  )
}
