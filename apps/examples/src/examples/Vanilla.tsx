import { between, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import { OneMinus, Time } from "shader-composer"
import {
  BoxGeometry,
  Color,
  Group,
  MeshStandardMaterial,
  Object3D,
  Vector2,
  Vector3
} from "three"
import { Particles, ParticlesMaterial } from "vfx-composer"
import {
  Acceleration,
  Lifetime,
  Scale,
  SetColor,
  Velocity
} from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { loop } from "./lib/loop"

const vanillaCode = (parent: Object3D) => {
  /* Define a few variables (attributes, uniforms, etc.) we'll use in our effect. */
  const variables = {
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3()),
    color: ParticleAttribute(new Color())
  }

  /* Create a Lifetime module. */
  const time = Time()
  const lifetime = Lifetime(variables.lifetime, time)

  /* Set up a module pipeline. */
  const modules = [
    lifetime.module,
    Scale(OneMinus(lifetime.ParticleProgress)),
    Velocity(variables.velocity, lifetime.ParticleAge),
    Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge),
    SetColor(variables.color)
  ]

  /*
  Create a particles material. These can patch themselves into existing
  material, like MeshStandardMaterial or MeshPhysicalMaterial!
  */
  const material = new ParticlesMaterial({
    baseMaterial: new MeshStandardMaterial({
      color: "hotpink"
    }),
    modules
  })

  /* Create geometry */
  const geometry = new BoxGeometry()

  /* Create mesh and add it to the scene. */
  const particles = new Particles(geometry, material, 1000)
  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(between(1, 5), ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(10))
      rotation.random()

      /* Write values into the instanced attributes */
      const { lifetime, velocity, color } = variables
      const t = time.uniform.value

      lifetime.value.set(t, t + between(1, 2))
      velocity.value.set(plusMinus(5), between(5, 18), plusMinus(5))
      color.value.setRGB(Math.random(), Math.random(), Math.random())
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
