import { between, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import { OneMinus, Time } from "shader-composer"
import {
  BoxGeometry,
  Group,
  MeshStandardMaterial,
  Object3D,
  Vector2,
  Vector3
} from "three"
import { Particles, ParticlesMaterial } from "vfx-composer"
import { Acceleration, Lifetime, Scale, Velocity } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { loop } from "./lib/loop"

const vanillaCode = (parent: Object3D) => {
  /* Define a few variables (attributes, uniforms, etc.) we'll use in our effect. */
  const variables = {
    lifetime: ParticleAttribute("vec2", () => new Vector2()),
    velocity: ParticleAttribute("vec3", () => new Vector3())
  }

  /* Create a Lifetime module. */
  const time = Time()
  const lifetime = Lifetime(variables.lifetime, time)

  /* Set up a module pipeline. */
  const modules = [
    lifetime.module,
    Scale(OneMinus(lifetime.ParticleProgress)),
    Velocity(variables.velocity, lifetime.ParticleAge)
    // Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge)
  ]

  /* Create material */
  const material = new ParticlesMaterial({
    baseMaterial: new MeshStandardMaterial({
      color: "hotpink"
    }),
    modules
  })

  /* Create geometry */
  const geometry = new BoxGeometry()

  /* Create mesh */
  const particles = new Particles(geometry, material, 1000)
  variables.lifetime.setupMesh(particles)
  variables.velocity.setupMesh(particles)
  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(1, ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(10))
      rotation.random()

      /* Set a lifetime */
      const { lifetime, velocity } = variables
      const t = time.uniform.value
      lifetime.setupParticle(particles, (v) => v.set(t, t + between(1, 2)))
      velocity.setupParticle(particles, (v) =>
        v.set(plusMinus(5), between(5, 18), plusMinus(5))
      )
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
