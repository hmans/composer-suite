import { useThree } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import { OneMinus, Time } from "shader-composer"
import {
  BoxGeometry,
  Color,
  Group,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three"
import { Particles, VFXMaterial } from "vfx-composer"
import {
  Acceleration,
  Lifetime,
  Scale,
  SetColor,
  Velocity
} from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { loop } from "./lib/loop"

const vanillaCode = (
  parent: Object3D,
  camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer
) => {
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
  const material = new VFXMaterial({
    baseMaterial: new MeshStandardMaterial({ color: "hotpink" }),
    modules
  })
  material.compileModules()

  /* Create mesh and add it to the scene. */
  const particles = new Particles(
    new BoxGeometry(0.2, 0.2, 0.2),
    material,
    1000
  )
  particles.position.set(2, 0, 0)
  parent.add(particles)
  particles.setupParticles()

  const particles2 = new Particles(new SphereGeometry(0.2), material, 1000)
  particles2.position.set(-2, 0, 0)
  parent.add(particles2)
  particles2.setupParticles()

  const stopLoop = loop((dt) => {
    material.tick(dt, camera, scene, renderer)

    const { lifetime, velocity, color } = variables
    const t = time.value

    /*
    Spawn a bunch of particles. The callback function will be invoked once
    per spawned particle, and is used to set up per-particle data that needs
    to be provided from JavaScript. (The nature of this data is up to you.)
    */
    particles.emit(between(1, 5), ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(2))
      rotation.random()

      /* Write values into the instanced attributes */
      lifetime.value.set(t, t + between(1, 2))
      velocity.value.set(plusMinus(2), between(2, 8), plusMinus(2))
      color.value.setRGB(Math.random(), Math.random(), Math.random())
    })

    particles2.emit(between(1, 5), ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(0.5))
      rotation.random()

      velocity.value.set(plusMinus(2), between(2, 4), plusMinus(2))
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
  const { camera, scene, gl } = useThree()
  useEffect(
    () => vanillaCode(group.current, camera as PerspectiveCamera, scene, gl),
    []
  )
  return <group ref={group}></group>
}
