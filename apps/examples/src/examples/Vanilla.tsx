import { useEffect, useRef } from "react"
import { BoxGeometry, Group, MeshStandardMaterial, Object3D } from "three"
import { Particles } from "vfx-composer"

const vanillaCode = (parent: Object3D) => {
  const geometry = new BoxGeometry()
  const material = new MeshStandardMaterial()
  const particles = new Particles(geometry, material, 10000)

  parent.add(particles)

  particles.spawn()
}

export const Vanilla = () => {
  const group = useRef<Group>(null!)
  useEffect(() => vanillaCode(group.current), [])
  return <group ref={group}></group>
}
