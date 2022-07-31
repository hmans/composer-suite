import { useFrame } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import { useRef } from "react"
import { OneMinus, Time } from "shader-composer"
import { Color, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { Particles as ParticlesImpl } from "vfx-composer"
import { Particles, ParticlesMaterial } from "vfx-composer/fiber"
import {
  Acceleration,
  Lifetime,
  Scale,
  SetColor,
  Velocity
} from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

const variables = {
  lifetime: ParticleAttribute(new Vector2()),
  velocity: ParticleAttribute(new Vector3()),
  color: ParticleAttribute(new Color())
}

const time = Time()
const lifetime = Lifetime(variables.lifetime, time)

export const Simple = () => {
  const particles = useRef<ParticlesImpl>(null!)

  useFrame(() => {
    const { lifetime, velocity, color } = variables
    const t = time.uniform.value

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
      <Particles args={[undefined, undefined, 1000]} ref={particles}>
        <boxGeometry />

        <ParticlesMaterial
          baseMaterial={new MeshStandardMaterial()}
          color="hotpink"
          modules={[
            SetColor(variables.color),
            Scale(OneMinus(lifetime.ParticleProgress)),
            Velocity(variables.velocity, lifetime.ParticleAge),
            Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge),
            lifetime.module
          ]}
        />
      </Particles>
    </group>
  )
}
