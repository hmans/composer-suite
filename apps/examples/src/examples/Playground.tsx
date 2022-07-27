import { between, plusMinus, power, upTo } from "randomish"
import { MutableRefObject, useEffect, useLayoutEffect, useRef } from "react"
import {
  $,
  Add,
  Attribute,
  CustomShaderMaterialMaster,
  Div,
  Float,
  InstanceMatrix,
  Mat3,
  Mul,
  OneMinus,
  pipe,
  Pow,
  Remap,
  Smoothstep,
  SplitVector2,
  Sub,
  Uniform,
  Value,
  Vec3,
  VertexPosition
} from "shader-composer"
import { useShader } from "shader-composer-r3f"
import {
  Color,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3
} from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const EffectAgeUniform = Uniform("float", 0)

const EffectAge = Float(EffectAgeUniform, {
  update: (dt) => (EffectAgeUniform.value += dt)
})

const [LifetimeStart, LifetimeEnd] = SplitVector2(Attribute("vec2", "lifetime"))

const ParticleAge = Sub(EffectAge, LifetimeStart)
const ParticleMaxAge = Sub(LifetimeEnd, LifetimeStart)
const ParticleProgress = Div(ParticleAge, ParticleMaxAge)

type ParticleValues = Record<string, any>

const AnimateScale = (scale: Value<"float"> = 1) => (position: Value<"vec3">) =>
  Mul(position, scale)

const AnimateStatelessVelocity = (velocity: Value<"vec3">) => (
  position: Value<"vec3">
) =>
  pipe(
    velocity,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, ParticleAge),
    (v) => Add(position, v)
  )

const AnimateStatelessAcceleration = (acceleration: Value<"vec3">) => (
  position: Value<"vec3">
) =>
  pipe(
    acceleration,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, Pow(ParticleAge, 2)),
    (v) => Mul(v, 0.5),
    (v) => Add(position, v)
  )

const ControlParticleLifetime = (v: Value<"vec3">) =>
  Vec3(v, {
    fragment: {
      body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
    }
  })

const makeAttribute = (count: number, itemSize: number) =>
  new InstancedBufferAttribute(new Float32Array(count * itemSize), itemSize)

/**
 * Prepares the given instanced mesh and returns an API for interacting with it.
 */
const useParticles = (
  imesh: MutableRefObject<InstancedMesh>,
  values: ParticleValues
) => {
  const position = pipe(
    /* Start with the original vertex position */
    VertexPosition,

    /* Animate the scale! Let's go all smoothsteppy! */
    AnimateScale(Smoothstep(0, 0.5, ParticleProgress)),

    /* We can layer multiple of these! */
    AnimateScale(Smoothstep(1.0, 0.8, ParticleProgress)),

    /* Gravity! */
    AnimateStatelessAcceleration(new Vector3(0, -10, 0)),

    /* Also animate velocity, sourcing per-particle velocity from a buffer attribute */
    AnimateStatelessVelocity(Attribute("vec3", "velocity"))
  )

  const color = pipe(Vec3(new Color("hotpink")), ControlParticleLifetime)

  /* Create attributes on the geometry */
  useLayoutEffect(() => {
    /* Prepare geometry */
    const { geometry, count } = imesh.current

    geometry.setAttribute("lifetime", makeAttribute(count, 2))

    for (const [name, value] of Object.entries(values)) {
      const itemSize = 3 // TODO: use proper item size
      geometry.setAttribute(name, makeAttribute(count, itemSize))
    }
  })

  let cursor = 0

  const spawn = (count: number = 1) => {
    if (!imesh.current) return

    const { geometry } = imesh.current

    for (let i = 0; i < count; i++) {
      /* Set the matrix at cursor */
      imesh.current.setMatrixAt(
        cursor,
        new Matrix4().compose(
          new Vector3().randomDirection(),
          new Quaternion().random(),
          new Vector3(1, 1, 1)
        )
      )

      /* Make up some lifetime */
      geometry.attributes.lifetime.setXY(
        cursor,
        EffectAgeUniform.value + between(0, 1),
        EffectAgeUniform.value + between(1, 2)
      )
      geometry.attributes.lifetime.needsUpdate = true

      /* Make up a velocity */
      for (const [name, valueOrFunction] of Object.entries(values)) {
        const value =
          typeof valueOrFunction === "function"
            ? valueOrFunction()
            : valueOrFunction
        geometry.attributes[name].setXYZ(cursor, value.x, value.y, value.z)
        geometry.attributes[name].needsUpdate = true
      }

      /* Advance cursor */
      cursor = (cursor + 1) % imesh.current.count

      imesh.current.instanceMatrix.needsUpdate = true
    }
  }

  return { spawn, color, position }
}

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, color, position } = useParticles(imesh, {
    velocity: () => new Vector3(plusMinus(2), between(5, 15), plusMinus(2)),
    acceleration: new Vector3(0, -10, 0)
  })

  const shader = useShader(() => {
    return CustomShaderMaterialMaster({
      diffuseColor: color,
      position
    })
  })

  useEffect(() => {
    const id = setInterval(() => {
      spawn(between(3, 5))
    }, 80)

    return () => clearInterval(id)
  }, [])

  return (
    <instancedMesh
      ref={imesh}
      args={[undefined, undefined, 10000]}
      position-y={2}
    >
      <boxGeometry />
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        {...shader}
      />
    </instancedMesh>
  )
}
