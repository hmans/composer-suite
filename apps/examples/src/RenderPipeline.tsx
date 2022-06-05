import { Effects } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { HalfFloatType, LinearEncoding, sRGBEncoding, Vector2 } from "three"
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"

extend({ UnrealBloomPass, AdaptiveToneMappingPass, ShaderPass })

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

export const RenderPipeline = () => (
  <Effects disableGamma encoding={LinearEncoding} type={HalfFloatType}>
    <unrealBloomPass args={[new Vector2(256, 256), 2, 0.1, 1]} />
    <adaptiveToneMappingPass args={[true, 256]} />
    <shaderPass args={[VignetteShader]} />
  </Effects>
)
