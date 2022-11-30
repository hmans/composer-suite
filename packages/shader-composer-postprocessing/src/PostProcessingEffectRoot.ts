import { $, Input, Root } from "@shader-composer/core"
import { InputAlpha, InputColor } from "./units"

export type PostProcessingEffectRootProps = {
  color?: Input<"vec3">
  alpha?: Input<"float">
}

export const PostProcessingEffectRoot = ({
  color = InputColor,
  alpha = InputAlpha
}: PostProcessingEffectRootProps) =>
  Root({
    fragment: {
      body: $`
        outputColor = vec4(${color}.rgb, ${alpha});
      `
    }
  })
