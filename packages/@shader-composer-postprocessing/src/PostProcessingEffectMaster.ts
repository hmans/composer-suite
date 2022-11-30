import {
  $,
  Input,
  Master
} from "../../@shader-composer-core/dist/shader-composer-core.cjs"
import { InputAlpha, InputColor } from "./units"

export type PostProcessingEffectMasterProps = {
  color?: Input<"vec3">
  alpha?: Input<"float">
}

export const PostProcessingEffectMaster = ({
  color = InputColor,
  alpha = InputAlpha
}: PostProcessingEffectMasterProps) =>
  Master({
    fragment: {
      body: $`
        outputColor = vec4(${color}.rgb, ${alpha});
      `
    }
  })
