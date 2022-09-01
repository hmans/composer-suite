import { useTexture } from "@react-three/drei"
import { MeshProps } from "@react-three/fiber"
import { composable, modules } from "material-composer-r3f"
import {
  Add,
  Div,
  GradientStops,
  Input,
  Mul,
  Negate,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Saturate,
  Smoothstep,
  Sub,
  Texture2D,
  TilingUV,
  Time,
  UV,
  vec2
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise2D } from "shader-composer-toybox"
import { DoubleSide, RepeatWrapping } from "three"
import { time } from "../Comet"
import streamTextureUrl from "../textures/stream.png"

export const Aura = ({
  gradient,
  tiling = vec2(3, 1),
  offset = vec2(0, 0),
  fullness = 0.5,
  wobble = 0,
  time = Time(),
  ...props
}: {
  gradient: GradientStops<"vec3">
  tiling?: Input<"vec2">
  offset?: Input<"vec2">
  fullness?: Input<"float">
  wobble?: Input<"float">
  time?: Input<"float">
} & MeshProps) => {
  /* Load texture */
  const streamTexture = useTexture(streamTextureUrl)
  streamTexture.wrapS = streamTexture.wrapT = RepeatWrapping

  /* Create sampler2D uniform */
  const streamSampler = useUniformUnit("sampler2D", streamTexture)

  /* Sample texture */
  const heat = Texture2D(streamSampler, TilingUV(UV, tiling, offset))

  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 32, 16]} />

      <composable.meshBasicMaterial
        transparent
        side={DoubleSide}
        depthWrite={false}
      >
        {wobble && <modules.SurfaceWobble offset={time} amplitude={wobble} />}
        <modules.Gradient
          stops={gradient}
          start={0}
          stop={1}
          position={heat.alpha}
        />
        <modules.Alpha alpha={Mul(0.5, Mul(heat.alpha, NoiseMask(fullness)))} />
      </composable.meshBasicMaterial>
    </mesh>
  )
}

export const NoiseMask = (
  threshold: Input<"float"> = 0.5,
  fringe: Input<"float"> = 0.5
) => {
  const noise = NormalizePlusMinusOne(
    PSRDNoise2D(TilingUV(UV, vec2(8, 8), vec2(0, Negate(time))))
  )

  return pipe(
    Smoothstep(
      Sub(threshold, Div(fringe, 2)),
      Add(threshold, Div(fringe, 2)),
      OneMinus(UV.y)
    ),
    (v) => Sub(v, Mul(noise, threshold)),
    Saturate
  )
}
