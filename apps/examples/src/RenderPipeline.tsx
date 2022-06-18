import { Effects } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { useControls } from "leva"
import { HalfFloatType, LinearEncoding, Vector2 } from "three"
import { AdaptiveToneMappingPass } from "three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"
import { AdaptiveResolution } from "./AdaptiveResolution"

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

export const RenderPipeline = ({ beautiful = true }) => {
  return (
    <Effects disableGamma encoding={LinearEncoding} type={HalfFloatType}>
      <unrealBloomPass
        args={[new Vector2(256, 256), 1.5, 0.1, 1]}
        enabled={beautiful}
      />
      {/* <adaptiveToneMappingPass args={[true, 256]} enabled={beautiful} /> */}
      <shaderPass args={[VignetteShader]} enabled={beautiful} />
    </Effects>
  )
}
