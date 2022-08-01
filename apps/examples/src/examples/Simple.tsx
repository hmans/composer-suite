import { between, plusMinus, upTo } from "randomish"
import React, { FC, useState } from "react"
import { OneMinus, Time } from "shader-composer"
import { Color, MeshStandardMaterial, Vector2, Vector3 } from "three"
import { makeParticles, ParticlesMaterial } from "vfx-composer/fiber"
import {
  Acceleration,
  Lifetime,
  Scale,
  SetColor,
  Velocity
} from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

import * as VFXModules from "vfx-composer/modules"
type VFXModules = typeof VFXModules

const vfxComponents = new Map()

type VFXProxy = {
  [K in keyof VFXModules]: FC<Parameters<VFXModules[K]>>
}

const VFX = new Proxy(vfxComponents as VFXProxy, {
  get(_, name) {
    if (typeof name !== "string") return undefined

    if (!vfxComponents.has(name)) {
      console.log(`creating new component for ${name}`)

      vfxComponents.set(name, () => {
        console.log(`Hi from VFX.${name}`)
        return <></>
      })
    }

    return vfxComponents.get(name)
  }
})

const Effect = makeParticles()

export const Simple = () => {
  const [variables] = useState(() => ({
    time: Time(),
    lifetime: ParticleAttribute(new Vector2()),
    velocity: ParticleAttribute(new Vector3()),
    color: ParticleAttribute(new Color())
  }))

  const lifetime = Lifetime(variables.lifetime, variables.time)

  return (
    <group>
      <Effect.Root maxParticles={1000}>
        <boxGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
          modules={[
            SetColor(variables.color),
            Scale(OneMinus(lifetime.ParticleProgress)),
            Velocity(variables.velocity, lifetime.ParticleAge),
            Acceleration(new Vector3(0, -10, 0), lifetime.ParticleAge),
            lifetime.module
          ]}
        >
          <VFX.Acceleration />
          <VFX.Acceleration />
          <VFX.Acceleration />
        </ParticlesMaterial>
      </Effect.Root>

      <Effect.Emitter
        count={1}
        continuous
        setup={({ position, rotation }) => {
          const t = variables.time.uniform.value
          const { lifetime, velocity, color } = variables

          /* Randomize the instance transform */
          position.randomDirection().multiplyScalar(upTo(6))
          rotation.random()

          /* Write values into the instanced attributes */
          lifetime.value.set(t, t + between(1, 2))
          velocity.value.set(plusMinus(5), between(5, 18), plusMinus(5))
          color.value.setRGB(Math.random(), Math.random(), Math.random())
        }}
      />
    </group>
  )
}
