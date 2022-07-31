import { useMemo, useRef } from "react"
import { OneMinus, Time } from "shader-composer"
import {
  BoxGeometry,
  Color,
  MeshStandardMaterial,
  Vector2,
  Vector3
} from "three"
import { ParticlesMaterial } from "vfx-composer"
import { Particles } from "vfx-composer/fiber"
import { Particles as ParticlesImpl } from "vfx-composer"
import {
  SetColor,
  Scale,
  Velocity,
  Acceleration,
  ModulePipe,
  Lifetime
} from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { useFrame } from "@react-three/fiber"
import { between, upTo, plusMinus } from "randomish"

export const Simple = () => {
  const variables = {
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3()),
    color: ParticleAttribute(new Color())
  }

  const time = Time()
  const lifetime = Lifetime(variables.lifetime, time)

  const particles = useRef<ParticlesImpl>(null!)

  const geometry = useMemo(() => new BoxGeometry(), [])

  const material = useMemo(() => {
    const modules = [
      SetColor(variables.color),
      Scale(OneMinus(lifetime.ParticleProgress)),
      Velocity(variables.velocity, lifetime.ParticleAge),
      Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge),
      lifetime.module
    ] as ModulePipe

    return new ParticlesMaterial({
      baseMaterial: new MeshStandardMaterial({ color: "hotpink" }),
      modules
    })
  }, [])

  useFrame((_, dt) => {
    const { lifetime, velocity, color } = variables
    const t = time.uniform.value

    material.tick(dt)

    /*
    Spawn a bunch of particles. The callback function will be invoked once
    per spawned particle, and is used to set up per-particle data that needs
    to be provided from JavaScript. (The nature of this data is up to you.)
    */
    particles.current.emit(between(1, 5), ({ position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(4))
      rotation.random()

      /* Write values into the instanced attributes */
      lifetime.value.set(t, t + between(1, 2))
      velocity.value.set(plusMinus(5), between(5, 18), plusMinus(5))
      color.value.setRGB(Math.random(), Math.random(), Math.random())
    })
  })

  return (
    <group>
      <Particles args={[geometry, material, 1000]} ref={particles}></Particles>
    </group>
  )
}
