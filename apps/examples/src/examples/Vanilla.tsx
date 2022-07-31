import { upTo } from "randomish"
import { useEffect, useRef } from "react"
import { Add, Time } from "shader-composer"
import { BoxGeometry, Group, MeshStandardMaterial, Object3D } from "three"
import { Particles, ParticlesMaterial } from "vfx-composer"
import { loop } from "./lib/loop"

const vanillaCode = (parent: Object3D) => {
  const geometry = new BoxGeometry()

  const material = new ParticlesMaterial({
    baseMaterial: MeshStandardMaterial,
    modules: [
      (state) => ({
        ...state,
        position: Add(state.position, Time())
      })
    ]
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
