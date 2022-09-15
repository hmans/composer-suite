import { Animate, float, rotate } from "@hmans/r3f-animate"
import { PatchedMaterialMaster } from "@material-composer/patch-material"
import { patched } from "@material-composer/patched"
import { Environment } from "@react-three/drei"
import { MeshProps } from "@react-three/fiber"
import { pipe } from "fp-ts/function"
import { useControls } from "leva"
import { Layers, useRenderPipeline } from "r3f-stage"
import {
  Add,
  Clamp,
  GlobalTime,
  Input,
  Mix,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  PerspectiveDepth,
  SceneColor,
  ScreenUV,
  Smoothstep,
  Step,
  Sub,
  Vec2,
  VertexNormal,
  VertexPosition
} from "shader-composer"
import { useShader, useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise2D, PSRDNoise3D } from "shader-composer-toybox"
import { Color } from "three"

export default function StylizedWater() {
  return (
    <group position-y={-2}>
      <Environment preset="sunset" />

      <Water />
      <Rock position={[-10, 0, -10]} scale={5} />
      <Rock position={[-10, -10, -10]} scale={10} />
      <Rock position={[-5, -10, -5]} scale={6} />
      <Rock position={[-3, -2, -8]} scale={4} rotation-y={2} />
      <Rock position={[3, -1, -5]} scale={2} rotation-y={1} />
      <FloatingOrb />
    </group>
  )
}

const Water = (props: MeshProps) => {
  const rp = useRenderPipeline()

  const depthSampler = useUniformUnit("sampler2D", rp.depth)
  const sceneSampler = useUniformUnit("sampler2D", rp.scene)

  /* We'll let the user control some values through Leva. */
  const controls = useControls("Water", {
    calmness: { value: 0.5, min: 0, max: 1 },
    shallow: "#00877d",
    deep: "#06192e",
    foam: "white"
  })

  /* Create uniforms for these values. */
  const calmness = useUniformUnit("float", controls.calmness)
  const colors = {
    shallow: useUniformUnit("vec3", new Color(controls.shallow)),
    deep: useUniformUnit("vec3", new Color(controls.deep)),
    foam: useUniformUnit("vec3", new Color(controls.foam))
  }

  // const scene = useRenderPass({ excludeLayer: Layers.TransparentFX })

  const shader = useShader(() => {
    /* Get a time uniform, always useful for time-based effects! */
    const time = GlobalTime

    /* Calculate some overlapping noise. We're going to use this
    to change the geometry original normals and scene color UVs to
    create the water surface effect. */
    const positionXY = Vec2([VertexPosition.x, VertexPosition.y])
    const waveNoise = Add(
      PSRDNoise2D(Add(positionXY, time)),
      PSRDNoise2D(Sub(positionXY, time))
    )

    /* Modify the screen UV based on the wave noise. */
    const refractedUV = pipe(
      waveNoise,
      (v) => Mul(v, 0.01),
      (v) => Add(ScreenUV, v)
    )

    /* Calculate the depth by comparing the current fragment's
    depth in view space to the depth of the scene. */
    const depth = pipe(
      depthSampler,
      (v) => PerspectiveDepth(refractedUV, v),
      (v) => Sub(VertexPosition.view.z, v)
    )

    /* Grab the original color from the pre-pass' render texture. */
    const originalColor = SceneColor(refractedUV, sceneSampler).color

    /* Let's decide on some factors for specific "parts" of the water
    surface by smooth-stepping the depth. */
    const deepFactor = Smoothstep(3, 8, depth)
    const foamFactor = Smoothstep(2, 0, depth)

    /* Now let's create a foam texture based on noise. */
    const foam = pipe(
      positionXY,
      (v) => Add(v, Mul(time, 0.2)),
      (v) => PSRDNoise2D(v),
      (v) => NormalizePlusMinusOne(v),
      (v) => Step(OneMinus(foamFactor), v),
      (v) => Clamp(0, 0.8, v)
    )

    /* Calculate the extent to which we will be "distorting" the water
    by changing its normals later */
    const surfaceDistortion = pipe(waveNoise, (v) => Mul(v, 0.2))

    /* Tired of all those pipes and variables? You can also just write
    functions! Like this one here, which takes a position, normal, and time,
    and changes the position so we'll end up with a "waves" animation. */
    const Waves = (
      position: Input<"vec3">,
      normal: Input<"vec3">,
      time: Input<"float">
    ) => {
      const scaledTime = Mul(time, 0.2)
      const scaledPosition = Mul(position, 0.1)
      const noise = PSRDNoise3D(Add(scaledPosition, scaledTime))
      const scaledNoise = Mul(noise, 0.2)

      return Add(position, Mul(normal, scaledNoise))
    }

    return PatchedMaterialMaster({
      /* Lerp between the new and the original position based on
      the value in the calmness variable. */
      position: Mix(
        Waves(VertexPosition, VertexNormal, time),
        VertexPosition,
        calmness
      ),

      color: pipe(
        /* Start with the "shallow water" color. */
        colors.shallow,
        /* Mix in the original scene color! */
        (v) => Mix(v, originalColor, 0.5),
        /* Add the "deep" color. */
        (v) => Mix(v, colors.deep, deepFactor),
        /* Add the "foam" color. */
        (v) => Mix(v, colors.foam, foam)
      ),

      /* We can also set per-fragment roughness, so let's dial it
      down for fragments that render foam. */
      roughness: foamFactor,

      /* Distort the normal based on calmness. */
      normal: Mix(Add(VertexNormal, surfaceDistortion), VertexNormal, calmness)
    })
  }, [])

  return (
    <mesh
      {...props}
      layers-mask={1 << Layers.TransparentFX}
      rotation-x={-Math.PI / 2}
    >
      <planeGeometry args={[100, 100, 137, 137]} />
      <patched.meshStandardMaterial
        metalness={0.5}
        roughness={0.1}
        {...shader}
      />
    </mesh>
  )
}

const Rock = (props: MeshProps) => (
  <mesh {...props}>
    <icosahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color="#555" />
  </mesh>
)

const FloatingOrb = () => (
  <Animate fun={float([1.3, 0.7, 0.5], [4, 3, 1])}>
    <Animate fun={rotate(2, 1.5, 0)}>
      <mesh>
        <icosahedronGeometry />
        <meshStandardMaterial color="#E9C46A" metalness={0.5} roughness={0.5} />
      </mesh>
    </Animate>
  </Animate>
)
