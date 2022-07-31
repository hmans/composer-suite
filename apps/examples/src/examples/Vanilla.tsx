import { upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  Add,
  compileShader,
  CustomShaderMaterialMaster,
  pipe,
  Time,
  VertexPosition
} from "shader-composer"
import {
  BoxGeometry,
  Color,
  Group,
  MeshStandardMaterial,
  Object3D
} from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { Particles, patchMaterial } from "vfx-composer"
import { ParticlesMaterial } from "vfx-composer/src/ParticlesMaterial"
import { loop } from "./lib/loop"

const vanillaCode = (parent: Object3D) => {
  const geometry = new BoxGeometry()

  const material = new ParticlesMaterial({
    baseMaterial: MeshStandardMaterial,
    shaderRoot: CustomShaderMaterialMaster({
      diffuseColor: new Color("hotpink"),
      position: pipe(VertexPosition, (v) => Add(v, Time()))
    })
  })

  const particles = new Particles(geometry, material, 10000)

  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(1, ({ position, rotation }) => {
      position.randomDirection().multiplyScalar(upTo(10))
      rotation.random()
    })
  })

  return () => {
    stopLoop()
    parent.remove(particles)
    particles.dispose()
    geometry.dispose()
    material.dispose()
  }
}

export const Vanilla = () => {
  const group = useRef<Group>(null!)
  useEffect(() => vanillaCode(group.current), [])
  return <group ref={group}></group>
}
