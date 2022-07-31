import { between, upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  $,
  Add,
  Div,
  Input,
  InstanceMatrix,
  mat3,
  Mul,
  OneMinus,
  pipe,
  SplitVector2,
  Sub,
  Time,
  vec2,
  Vec3
} from "shader-composer"
import {
  BoxGeometry,
  Group,
  MeshStandardMaterial,
  Object3D,
  Vector2,
  Vector3
} from "three"
import { Particles, ParticlesMaterial } from "vfx-composer"
import {
  Acceleration,
  Gravity,
  Lifetime,
  Module,
  Scale,
  Velocity
} from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { loop } from "./lib/loop"

const vanillaCode = (parent: Object3D) => {
  /* Define a few variables (attributes, uniforms, etc.) we'll use in our effect. */
  const variables = {
    lifetime: ParticleAttribute("vec2", () => new Vector2())
  }

  /* Create a Lifetime module. */
  const time = Time()
  const lifetime = Lifetime(variables.lifetime, time)

  /* Set up a module pipeline. */
  const modules = [
    lifetime.module,
    Velocity(new Vector3(0, 20, 0), lifetime.ParticleAge),
    Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge),
    Scale(OneMinus(lifetime.ParticleAge))
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
  const particles = new Particles(geometry, material, 10000)
  variables.lifetime.setupMesh(particles)
  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(1, ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(10))
      rotation.random()

      /* Set a lifetime */
      const t = time.uniform.value
      variables.lifetime.setupParticle(particles, (lifetime) =>
        lifetime.set(t, t + between(1, 2))
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
