import { $, Input, Master } from "shader-composer"

export type PostProcessingEffectMasterProps = {
  color?: Input<"vec3">
  alpha?: Input<"float">
}

export const PostProcessingEffectMaster = ({
  color = $`inputColor`,
  alpha = $`inputAlpha`
}: PostProcessingEffectMasterProps) =>
  Master({
    fragment: {
      body: $`
        vec3 inputColor = inputColorRGBA.rgb;
        float inputAlpha = inputColorRGBA.a;

        outputColorRGBA = vec4(${color}.rgb, ${alpha});
      `
    }
  })
