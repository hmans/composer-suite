import { Effects } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { HalfFloatType, LinearEncoding, Vector2 } from "three"
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"

extend({ UnrealBloomPass, AdaptiveToneMappingPass, ShaderPass, RenderPass })

type EffectsPassProps<T extends { new (...args: any): any }> = {
  args?: ConstructorParameters<T>
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: EffectsPassProps<typeof UnrealBloomPass>
      adaptiveToneMappingPass: EffectsPassProps<typeof AdaptiveToneMappingPass>
    }
  }
}

export const RenderPipeline = ({
  bloom = false,
  toneMapping = false,
  vignette = false
}) => (
  <Effects disableGamma encoding={LinearEncoding} type={HalfFloatType}>
    {bloom && <unrealBloomPass args={[new Vector2(256, 256), 2, 0.05, 1]} />}
    {toneMapping && <adaptiveToneMappingPass args={[true, 256]} />}
    {vignette && <shaderPass args={[VignetteShader]} />}
  </Effects>
)
