import { between, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import { OneMinus, Time } from "shader-composer"
import {
  BoxGeometry,
  Color,
  Group,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
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
  const lifetime = Lifetime({ lifetime: variables.lifetime, time })

  /*
  The behavior of your particle effects is defined by a series of modules. Each
  of these can change the particle's position, color, opacity, and so on.
  VFX Composer comes with a collection of these modules, as well as some
  preconfigured module pipelines, but you can of course just create your own.
  */
  const modules = [
    SetColor({ color: variables.color }),
    Scale({ scale: OneMinus(lifetime.ParticleProgress) }),
    Velocity({ velocity: variables.velocity, time: lifetime.ParticleAge }),
    Acceleration({ force: new Vector3(0, -10, 0), time: lifetime.ParticleAge }),
    lifetime.module
  ]

  /*
  Create a particles material. These can patch themselves into existing
  material, like MeshStandardMaterial or MeshPhysicalMaterial!
  */
  const material = new ParticlesMaterial({
    baseMaterial: new MeshStandardMaterial({ color: "hotpink" }),
    modules
  })

  // material.modules = modules
  // material.setupShader()

  /* Create mesh and add it to the scene. */
  const particles = new Particles(new BoxGeometry(), material, 1000)
  particles.position.set(10, 0, 0)
  parent.add(particles)
  particles.setupParticles()

  const particles2 = new Particles(new SphereGeometry(), material, 1000)
  particles2.position.set(-10, 0, 0)
  parent.add(particles2)
  particles2.setupParticles()

  const stopLoop = loop((dt) => {
    material.tick(dt)

    const { lifetime, velocity, color } = variables
    const t = time.uniform.value

    /*
    Spawn a bunch of particles. The callback function will be invoked once
    per spawned particle, and is used to set up per-particle data that needs
    to be provided from JavaScript. (The nature of this data is up to you.)
    */
    particles.emit(between(1, 5), ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(4))
      rotation.random()

      /* Write values into the instanced attributes */
      lifetime.value.set(t, t + between(1, 2))
      velocity.value.set(plusMinus(5), between(5, 18), plusMinus(5))
      color.value.setRGB(Math.random(), Math.random(), Math.random())
    })

    particles2.emit(between(1, 5), ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(2))
      rotation.random()

      velocity.value.set(plusMinus(5), between(5, 6), plusMinus(5))
      color.value.setRGB(Math.random(), Math.random(), Math.random())
    })
  })

  return () => {
    stopLoop()
    parent.remove(particles)
    parent.remove(particles2)

    particles.geometry.dispose()
    particles.dispose()
    particles2.geometry.dispose()
    particles2.dispose()
    material.dispose()
  }
}

export const Vanilla = () => {
  const group = useRef<Group>(null!)
  useEffect(() => vanillaCode(group.current), [])
  return <group ref={group}></group>
}
