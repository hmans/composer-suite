import { useControls } from "leva"
import {
  Color,
  Fresnel,
  Gradient,
  Layer,
  LayerProps,
  MaterialModules,
  SurfaceWobble
} from "material-composer-r3f"
import { useUniformUnit } from "shader-composer-r3f"
import * as THREE from "three"

export const ColorLayer = (props: LayerProps) => {
  const controls = useControls("Color", {
    mix: { value: 1, min: 0, max: 1 },
    color: "#b10000"
  })

  const mix = useUniformUnit("float", controls.mix)
  const color = useUniformUnit("vec3", new THREE.Color(controls.color))

  return (
    <Layer opacity={mix} {...props}>
      <Color color={color} />
    </Layer>
  )
}

export const GradientLayer = (props: LayerProps) => {
  const controls = useControls("Gradient", {
    mix: { value: 0.5, min: 0, max: 1 },
    contrast: { value: 1, min: 0, max: 10 },
    colorA: "#00bbf9",
    stopA: { value: 0, min: 0, max: 1 },
    colorB: "#9d0208",
    stopB: { value: 0.5, min: 0, max: 1 },
    colorC: "#fee440",
    stopC: { value: 1, min: 0, max: 1 }
  })

  const mix = useUniformUnit("float", controls.mix)
  const contrast = useUniformUnit("float", controls.contrast)
  const colorA = useUniformUnit("vec3", new THREE.Color(controls.colorA))
  const stopA = useUniformUnit("float", controls.stopA)
  const colorB = useUniformUnit("vec3", new THREE.Color(controls.colorB))
  const stopB = useUniformUnit("float", controls.stopB)
  const colorC = useUniformUnit("vec3", new THREE.Color(controls.colorC))
  const stopC = useUniformUnit("float", controls.stopC)

  return (
    <Layer opacity={mix} {...props}>
      <Gradient
        stops={[
          [colorA, stopA],
          [colorB, stopB],
          [colorC, stopC]
        ]}
        contrast={contrast}
      />
    </Layer>
  )
}

export const FresnelLayer = (props: LayerProps) => {
  const controls = useControls("Fresnel", {
    mix: { value: 0.5, min: 0, max: 1 },
    intensity: { value: 5, min: 0, max: 10 },
    power: { value: 4, min: 0, max: 8 }
  })

  const mix = useUniformUnit("float", controls.mix)
  const intensity = useUniformUnit("float", controls.intensity)
  const power = useUniformUnit("float", controls.power)

  return (
    <Layer opacity={mix} blend="add" {...props}>
      <Fresnel intensity={intensity} power={power} />
    </Layer>
  )
}

export const WobbleLayer = (props: LayerProps) => {
  const controls = useControls("Wobble", {
    mix: { value: 0.1, min: 0, max: 1 },
    amplitude: { value: 0.5, min: 0, max: 1 },
    offset: { value: 0, step: 0.01 }
  })

  const mix = useUniformUnit("float", controls.mix)
  const amplitude = useUniformUnit("float", controls.amplitude)
  const offset = useUniformUnit("float", controls.offset)

  return (
    <Layer opacity={mix} {...props}>
      <SurfaceWobble amplitude={amplitude} offset={offset} />
    </Layer>
  )
}

export default function CombinedModules() {
  return (
    <group position-y={1.5}>
      <mesh castShadow>
        <icosahedronGeometry args={[1, 8]} />

        <meshStandardMaterial autoShadow>
          <MaterialModules>
            <ColorLayer />
            <GradientLayer />
            <FresnelLayer />
            <WobbleLayer />
          </MaterialModules>
        </meshStandardMaterial>
      </mesh>
    </group>
  )
}
