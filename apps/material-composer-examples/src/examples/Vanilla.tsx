import { useThree } from "@react-three/fiber"
import { compileModules, Layer, patchMaterial } from "material-composer"
import * as modules from "material-composer/modules"
import { Description } from "r3f-stage"
import { useEffect, useRef } from "react"
import {
  compileShader,
  Mul,
  NormalizePlusMinusOne,
  Sin,
  Time
} from "shader-composer"
import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three"
import { LavaModule } from "./Fireball"
import { loop } from "./lib/loop"
import { PlasmaModule } from "./PlasmaBall"

const vanillaCode = (
  parent: Object3D,
  camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer
) => {
  const time = Time()

  /* Create a material instance */
  const material = new MeshStandardMaterial({
    transparent: true,
    side: DoubleSide
  })

  /* Create a shader graph from a list of modules */
  const graph = compileModules([
    Layer({
      modules: [PlasmaModule({ offset: Mul(time, -0.2) })]
    }),

    Layer({
      opacity: NormalizePlusMinusOne(Sin(time)),
      modules: [
        modules.SurfaceWobble({ offset: Mul(time, 0.4), amplitude: 0.3 }),
        LavaModule({}),
        modules.Alpha({ alpha: 1 })
      ]
    })
  ])

  /* Compile the shader graph into an actual shader */
  const [shader, shaderMeta] = compileShader(graph)

  /* Apply the shader to the material */
  patchMaterial(material, shader)

  const sphere = new Mesh(new SphereGeometry(), material)
  sphere.position.y = 1.5
  parent.add(sphere)

  /* Create mesh and add it to the scene. */
  const stopLoop = loop((dt) => {
    shaderMeta.update(dt, camera, scene, renderer)
  })

  return () => {
    stopLoop()

    parent.remove(sphere)
    sphere.geometry.dispose()
    material.dispose()
    shaderMeta.dispose()
  }
}

export default function Vanilla() {
  const group = useRef<Group>(null!)
  const { camera, scene, gl } = useThree()
  useEffect(
    () => vanillaCode(group.current, camera as PerspectiveCamera, scene, gl),
    []
  )
  return (
    <group ref={group}>
      <Description>
        An example of how to use Material Composer with vanilla Three.js.
      </Description>
    </group>
  )
}
