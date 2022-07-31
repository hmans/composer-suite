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
  ModulePipe,
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

  /*
  The behavior of your particle effects is defined by a series of modules. Each
  of these can change the particle's position, color, opacity, and so on.
  VFX Composer comes with a collection of these modules, as well as some
  preconfigured module pipelines, but you can of course just create your own.
  */
  const modules = [
    SetColor(variables.color),
    Scale(OneMinus(lifetime.ParticleProgress)),
    Velocity(variables.velocity, lifetime.ParticleAge),
    Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge),
    lifetime.module
  ].filter((d) => !!d) as ModulePipe

  /*
  Create a particles material. These can patch themselves into existing
  material, like MeshStandardMaterial or MeshPhysicalMaterial!
  */
  const material = new ParticlesMaterial({
    baseMaterial: new MeshStandardMaterial({ color: "hotpink" }),
    modules
  })

  /* Create geometry */
  const geometry = new BoxGeometry()

  /* Create mesh and add it to the scene. */
  const particles = new Particles(geometry, material, 1000)
  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    /*
    Spawn a bunch of particles. The callback function will be invoked once
    per spawned particle, and is used to set up per-particle data that needs
    to be provided from JavaScript. (The nature of this data is up to you.)
    */
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
