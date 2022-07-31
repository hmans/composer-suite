import { between, upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  $,
  Add,
  Div,
  Input,
  InstanceMatrix,
  mat3,
  Mul,
  pipe,
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
  Vector2,
  Vector3
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

  return {
    module,
    ParticleAge,
    ParticleMaxAge,
    ParticleStartTime,
    ParticleEndTime,
    ParticleProgress
  }
}

export const Translate = (offset: Input<"vec3">): Module => (state) => ({
  ...state,
  position: pipe(
    offset,
    (v) => Mul(v, mat3(InstanceMatrix)),
    (v) => Add(state.position, v)
  )
})

export const Velocity = (velocity: Input<"vec3">, time: Input<"float">) =>
  Translate(Mul(velocity, time))

const vanillaCode = (parent: Object3D) => {
  const time = Time()
  const lifetimeAttribute = ParticleAttribute("vec2", () => new Vector2())
  const lifetime = Lifetime(lifetimeAttribute, time)

  const modules = [
    lifetime.module,
    Velocity(new Vector3(0, 10, 0), lifetime.ParticleAge)
  ]

  /* Create material */
  const material = new ParticlesMaterial({
    baseMaterial: new MeshStandardMaterial({
      color: "hotpink"
    }),
    modules
  })

  /* Create geometry */
  const geometry = new BoxGeometry()

  /* Create mesh */
  const particles = new Particles(geometry, material, 10000)
  lifetimeAttribute.setupMesh(particles)
  parent.add(particles)

  const stopLoop = loop((dt) => {
    material.tick(dt)

    particles.spawn(1, ({ cursor, position, rotation }) => {
      /* Randomize the instance transform */
      position.randomDirection().multiplyScalar(upTo(10))
      rotation.random()

      /* Set a lifetime */
      const t = time.uniform.value
      lifetimeAttribute.setupParticle(particles, (lifetime) =>
        lifetime.set(t, t + between(1, 2))
      )
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
