import { between, plusMinus, upTo } from "randomish"
import { FC, useLayoutEffect, useMemo, useState } from "react"
import { OneMinus, Time } from "shader-composer"
import { Color, MeshStandardMaterial, Vector2, Vector3 } from "three"
import {
  makeParticles,
  ParticlesMaterial,
  useParticlesMaterialContext
} from "vfx-composer/fiber"
import { Lifetime, Module } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"

import * as VFXModules from "vfx-composer/modules"
type VFXModules = typeof VFXModules

const vfxComponents = new Map<keyof VFXModules, VFXComponent<any>>()

type VFXComponentProps<K extends keyof VFXModules> = Parameters<
  VFXModules[K]
>[0]

type VFXComponent<K extends keyof VFXModules> = FC<VFXComponentProps<K>>

type VFXProxy = {
  [K in keyof VFXModules]: VFXModules[K] extends (...args: any[]) => Module
    ? VFXComponent<K>
    : never
}

const makeComponent = <K extends keyof VFXModules>(
  name: K
): VFXComponent<K> => (props) => {
  const { addModule, removeModule } = useParticlesMaterialContext()

  const module = useMemo(() => VFXModules[name](props as any) as Module, [
    name,
    props
  ])

  useLayoutEffect(() => {
    addModule(module)
    return () => removeModule(module)
  }, [module])

  return null
}

const VFX = new Proxy<VFXProxy>({} as VFXProxy, {
  get(_, name: keyof VFXModules) {
    if (!vfxComponents.has(name)) {
      vfxComponents.set(name, makeComponent(name) as any)
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

  const lifetime = Lifetime({
    lifetime: variables.lifetime,
    time: variables.time
  })

  return (
    <group>
      <Effect.Root maxParticles={1000}>
        <boxGeometry />

        <ParticlesMaterial baseMaterial={MeshStandardMaterial} color="hotpink">
          <VFX.Scale scale={OneMinus(lifetime.ParticleProgress)} />
          <VFX.Velocity
            velocity={variables.velocity}
            time={lifetime.ParticleAge}
          />
          <VFX.Acceleration
            force={new Vector3(0, -10, 0)}
            time={lifetime.ParticleAge}
          />

          <VFX.SetColor color={variables.color} />
          <VFX.Module module={lifetime.module} />
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
