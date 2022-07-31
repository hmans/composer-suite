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
import { BoxGeometry, Group, MeshStandardMaterial, Object3D } from "three"
import { Particles, ParticlesMaterial } from "vfx-composer"
import { Module } from "vfx-composer/modules"
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
  const geometry = new BoxGeometry()

  const lifetime = Lifetime(vec2(0, 100), Time())

  const material = new ParticlesMaterial({
    baseMaterial: MeshStandardMaterial,
    modules: [
      lifetime.module,
      (state) => ({
        ...state,
        position: Add(state.position, lifetime.ParticleAge)
      })
    ]
  })

  const particles = new Particles(geometry, material, 10000)

  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(1, ({ position, rotation }) => {
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
