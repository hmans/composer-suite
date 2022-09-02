import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import { pipe } from "fp-ts/function"
import { useControls } from "leva"
import { Mix } from "shader-composer"
import { useShader, useUniformUnit } from "shader-composer-r3f"
import { Dissolve } from "shader-composer-toybox"
import { Color, DoubleSide } from "three"

export default function DissolveExample() {
  /* Leva */
  const sphereOpts = useControls("Sphere", { color: "#666" })
  const dissolveOpts = useControls("Dissolve", {
    edgeColor: "#0ef",
    edgeColorIntensity: { value: 2, min: 0, max: 5 },
    edgeThickness: { value: 0.2, min: 0, max: 1 },
    scale: { value: 2.5, min: 0, max: 5 },
    visibility: { value: 0.5, min: 0, max: 1 }
  })

  /* Uniforms */
  const sphereColor = useUniformUnit("vec3", new Color(sphereOpts.color))
  const dissolveVisibility = useUniformUnit("float", dissolveOpts.visibility)
  const dissolveScale = useUniformUnit("float", dissolveOpts.scale)
  const dissolveEdgeColor = useUniformUnit(
    "vec3",
    new Color(dissolveOpts.edgeColor).multiplyScalar(
      dissolveOpts.edgeColorIntensity
    )
  )
  const dissolveEdgeThickness = useUniformUnit(
    "float",
    dissolveOpts.edgeThickness
  )

  /* Shader */
  const shader = useShader(() => {
    const dissolve = Dissolve(
      dissolveVisibility,
      dissolveScale,
      dissolveEdgeThickness
    )

    return PatchedMaterialMaster({
      color: pipe(sphereColor, (v) => Mix(v, dissolveEdgeColor, dissolve.edge)),
      alpha: dissolve.alpha
    })
  }, [])

  /* Scene Object */
  return (
    <mesh>
      <icosahedronGeometry args={[1, 10]} />
      <patched.meshPhysicalMaterial
        {...shader}
        transparent
        side={DoubleSide}
        metalness={0.1}
        roughness={0.2}
      />
    </mesh>
  )
}
