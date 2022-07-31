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
import { loop } from "./lib/loop"

const vanillaCode = (parent: Object3D) => {
  const geometry = new BoxGeometry()
  const material = new MeshStandardMaterial({ color: "red" })
  const patchedMaterial = patchMaterial(material)
  const particles = new Particles(geometry, patchedMaterial, 10000)

  parent.add(particles)

  const stopLoop = loop((dt) => {
    patchedMaterial.tick(dt)

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
