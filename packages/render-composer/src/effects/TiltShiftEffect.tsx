import { pipe } from "fp-ts/function"
import * as PP from "postprocessing"
import {
  $,
  Input,
  Resolution,
  Snippet,
  UV,
  varying,
  Vec2,
  Vec3,
  Vec4
} from "shader-composer"
import {
  InputColor,
  PostProcessingEffectMaster,
  ShaderComposerEffect
} from "shader-composer-postprocessing"
import { Color } from "three"
import { usePostProcessingEffect } from "../lib/usePostProcessingEffect"

export type TiltShiftEffectProps = ConstructorParameters<
  typeof TiltShiftEffectImpl
>[0]

export const TiltShiftEffect = (props: TiltShiftEffectProps) => {
  usePostProcessingEffect(() => new TiltShiftEffectImpl(props), props)
  return null
}

export type TiltShiftEffectArgs = {
  blendFunction?: PP.BlendFunction
}

const random = Snippet(
  (random) => $`
  float ${random}(vec3 scale, float seed) {
    /* use the fragment position for a different seed per-pixel */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
  }
`
)

const TiltShiftUnit = (
  inputColor: Input<"vec3">,
  start: Input<"vec2">,
  end: Input<"vec2">,
  delta: Input<"vec2">,
  blurRadius: Input<"float">,
  gradientRadius: Input<"float">,
  sampleCount: Input<"float">
) =>
  Vec3(inputColor, {
    fragment: {
      body: $`
      vec3 color = vec3(0.0);
      float total = 0.0;
      vec2 startPixel = vec2(${start}.x * ${Resolution}.x, ${start}.y * ${Resolution}.y);
      vec2 endPixel = vec2(${end}.x * ${Resolution}.x, ${end}.y * ${Resolution}.y);

      /* randomize the lookup values to hide the fixed number of samples */
      float offset = ${random}(vec3(12.9898, 78.233, 151.7182), 0.0);

      vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
      float radius = smoothstep(0.0, 1.0,
        abs(dot(uv * ${Resolution} - startPixel, normal)) / ${gradientRadius}) * ${blurRadius};

      float firstSample = ${sampleCount} / -2.0;
      float lastSample = ${sampleCount} / 2.0;

      // for (float t = -30.0; t <= 30.0; t++) {
      for (float t = firstSample; t <= lastSample; t++) {
          float percent = (t + offset - 0.5) / lastSample;
          float weight = 1.0 - abs(percent);

          vec4 sample_t = texture2D(inputBuffer, uv + ${delta} / ${Resolution} * percent * radius);

          /* switch to pre-multiplied alpha to correctly blur transparent images */
          sample_t.rgb *= sample_t.a;

          color += vec3(sample_t) * weight;
          total += weight;
      }

      value = color / total;

      /* switch back from pre-multiplied alpha */
      // value.rgb /= value.a + 0.00001;
    `
    }
  })

export class TiltShiftEffectImpl extends ShaderComposerEffect {
  constructor({
    blendFunction = PP.BlendFunction.NORMAL
  }: TiltShiftEffectArgs) {
    super({
      blendFunction,
      root: PostProcessingEffectMaster({
        color: TiltShiftUnit(
          InputColor,
          Vec2([0, 0.5]),
          Vec2([1, 0.5]),
          Vec2([1, 1]),
          10,
          400,
          40
        )
      })
    })
  }
}
