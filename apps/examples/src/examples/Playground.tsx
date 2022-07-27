import { plusMinus, upTo } from "randomish"
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
  Remap,
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

const AnimateScale = (scale: Value<"float"> = 1) => (position: Value<"vec3">) =>
  Mul(position, scale)

const AnimateVelocityOverTime = (velocity: Value<"vec3">) => (
  position: Value<"vec3">
) =>
  pipe(
    velocity,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, ParticleAge),
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
const useParticles = (imesh: MutableRefObject<InstancedMesh>) => {
  const position = pipe(
    VertexPosition,
    AnimateScale(Remap(ParticleProgress, 0, 1, 0, 5)),
    // AnimateScale(OneMinus(ParticleProgress)),
    AnimateVelocityOverTime(Attribute("vec3", "velocity"))
  )

  const color = pipe(Vec3(new Color("hotpink")), ControlParticleLifetime)

  /* Create attributes on the geometry */
  useLayoutEffect(() => {
    /* Prepare geometry */
    const { geometry, count } = imesh.current

    geometry.setAttribute("lifetime", makeAttribute(count, 2))
    geometry.setAttribute("velocity", makeAttribute(count, 3))
  })

  let cursor = 0

  const spawn = () => {
    if (!imesh.current) return

    const { geometry, material } = imesh.current

    console.log("cursor:", cursor)

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
      EffectAgeUniform.value,
      EffectAgeUniform.value + 1
    )
    geometry.attributes.lifetime.needsUpdate = true

    /* Make up a velocity */
    geometry.attributes.velocity.setXYZ(
      cursor,
      ...new Vector3(plusMinus(1), upTo(5), plusMinus(1)).toArray()
    )
    geometry.attributes.velocity.needsUpdate = true

    /* Advance cursor */
    cursor = (cursor + 1) % imesh.current.count

    imesh.current.instanceMatrix.needsUpdate = true
  }

  return { spawn, color, position }
}

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, color, position } = useParticles(imesh)

  const shader = useShader(() => {
    return CustomShaderMaterialMaster({
      diffuseColor: color,
      position
    })
  })

  useEffect(() => {
    const id = setInterval(() => {
      spawn()
    }, 80)

    return () => clearInterval(id)
  }, [])

  return (
    <instancedMesh
      ref={imesh}
      args={[undefined, undefined, 1000]}
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
