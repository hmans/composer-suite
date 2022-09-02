import { useControls } from "leva"
import {
  $,
  Add,
  Fresnel,
  GlobalTime,
  Mix,
  NormalizePlusMinusOne,
  pipe,
  ShaderMaterialMaster,
  Sin,
  Time,
  VertexPosition
} from "shader-composer"
import { useShader, useUniformUnit } from "shader-composer-r3f"
import { Color } from "three"

export default function HelloWorld() {
  /* We're using Leva to let the user control the colors. */
  const leva = useControls("Uniforms", {
    color1: "#bc23c2",
    color2: "#c7be13"
  })

  /* Here we're creating two uniforms and feeding the
	user-provided colors into them. */
  const color1 = useUniformUnit("vec3", new Color(leva.color1))
  const color2 = useUniformUnit("vec3", new Color(leva.color2))

  /* Let's create the shader itself! */
  const shader = useShader(() => {
    /* Create a time unit, always useful! */
    const time = GlobalTime

    return ShaderMaterialMaster({
      /* Set the color as a time-based mix between the two colors. */
      color: pipe(
        color1,
        (v) => Mix(v, color2, NormalizePlusMinusOne(Sin(time))),
        (v) => Add(v, Fresnel())
      ),

      /* Also do a little vertex displacement. Just for fun, we'll use
			a GLSL expression here. They're pretty cool, because their dependencies
			are still part of the shader graph! */
      position: $`${VertexPosition} * (1.0 + sin(${time} + ${VertexPosition}.y * 2.0) * 0.2)`
    })
  }, [])

  return (
    <mesh>
      <sphereGeometry />

      {/* We can just splat the complete shader object into shaderMaterial: */}
      <shaderMaterial {...shader} key={Math.random()} />
    </mesh>
  )
}
