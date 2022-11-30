import { pipe } from "fp-ts/function"
import {
  Add,
  Mul,
  Round,
  ShaderMaterialMaster,
  Time,
  VertexPosition
} from "shader-composer"
import { useShader } from "@shader-composer/r3f"
import { Simplex3DNoise } from "shader-composer-toybox"
import { Color } from "three"

export const Background = () => {
  const shader = useShader(() => {
    return ShaderMaterialMaster({
      color: pipe(
        VertexPosition,
        (v) => Mul(v, 0.5),
        (v) => Round(v),
        (v) => Add(v, Time()),
        (v) => Simplex3DNoise(v),
        (v) => Mul(v, 0.1),
        (v) => Add(v, 0.1),
        (v) => Mul(new Color("#333"), v)
      )
    })
  }, [])

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[200, 200]} />
      <shaderMaterial {...shader} key={Math.random()} />
    </mesh>
  )
}
