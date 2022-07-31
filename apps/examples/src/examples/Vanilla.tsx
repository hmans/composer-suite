import { upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  $,
  Add,
  Div,
  Input,
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
  Vector2
} from "three"
import { Particles, ParticlesMaterial } from "vfx-composer"
import { Module } from "vfx-composer/modules"
import { ParticleAttribute } from "vfx-composer/units"
import { loop } from "./lib/loop"

const Lifetime = (lifetime: Input<"vec2">, time: Input<"float">) => {
  const [ParticleStartTime, ParticleEndTime] = SplitVector2(lifetime)

  const ParticleMaxAge = Sub(ParticleEndTime, ParticleStartTime)
  const ParticleAge = Sub(time, ParticleStartTime)
  const ParticleProgress = Div(ParticleAge, ParticleMaxAge)

  const module: Module = (state) => ({
    ...state,
    color: Vec3(state.color, {
      fragment: {
        body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
      }
    })
  })

  return { module, ParticleAge, ParticleProgress }
}

const vanillaCode = (parent: Object3D) => {
  const time = Time()

  const geometry = new BoxGeometry()

  const lifetimeAttribute = ParticleAttribute("vec2", () => new Vector2(0, 100))

  const lifetime = Lifetime(lifetimeAttribute, time)

  const material = new ParticlesMaterial({
    baseMaterial: new MeshStandardMaterial({
      color: "hotpink"
    }),
    modules: [
      lifetime.module,
      (state) => ({
        ...state,
        position: Add(state.position, lifetime.ParticleAge)
      })
    ]
  })

  const particles = new Particles(geometry, material, 10000)

  lifetimeAttribute.setupMesh(particles)

  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(1, ({ cursor, position, rotation }) => {
      /* Terrible workaround */
      const t = time._unitConfig.value.value

      lifetimeAttribute.value.set(t, t + 2)
      lifetimeAttribute.setupParticle(particles, cursor)
      position.randomDirection().multiplyScalar(upTo(10))
      rotation.random()
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
