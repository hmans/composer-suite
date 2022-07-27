import { flow } from "fp-ts/es6/function"
import { MutableRefObject, useEffect, useLayoutEffect, useRef } from "react"
import {
  $,
  Add,
  CustomShaderMaterialMaster,
  Div,
  Float,
  GLSLType,
  InstanceMatrix,
  Mul,
  OneMinus,
  pipe,
  SplitVector2,
  Sub,
  Uniform,
  Unit,
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

const Attribute = <T extends GLSLType>(type: T, name: string) =>
  Unit(type, $`${name}`, {
    name: `Attribute: ${name}`,
    varying: true,
    vertex: {
      header: $`attribute ${type} ${name};`
    }
  })

const makeAttribute = (count: number, itemSize: number) =>
  new InstancedBufferAttribute(new Float32Array(count * itemSize), itemSize)

/**
 * Prepares the given instanced mesh and returns an API for interacting with it.
 */
const useParticles = (imesh: MutableRefObject<InstancedMesh>) => {
  const EffectAgeUniform = Uniform("float", 0)

  const EffectAge = Float(EffectAgeUniform, {
    update: (dt) => (EffectAgeUniform.value += dt)
  })

  const [LifetimeStart, LifetimeEnd] = SplitVector2(
    Attribute("vec2", "lifetime")
  )

  const ParticleAge = Sub(EffectAge, LifetimeStart)
  const ParticleMaxAge = Sub(LifetimeEnd, LifetimeStart)
  const ParticleProgress = Div(ParticleAge, ParticleMaxAge)

  const ControlParticleLifetime = (v: Value<"vec3">) =>
    Vec3(v, {
      fragment: {
        body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
      }
    })

  const AnimateScaleOverTime = (v: Value<"vec3">) => {
    return Mul(v, OneMinus(ParticleProgress))
  }

  const AnimateVelocityOverTime = (v: Value<"vec3">) => {
    const offset = pipe(
      Attribute("vec3", "velocity"),
      (v) => Vec3($`${v} * mat3(${InstanceMatrix})`),
      (v) => Mul(v, ParticleAge)
    )

    return Add(v, offset)
  }

  const position = pipe(
    VertexPosition,
    AnimateScaleOverTime,
    AnimateVelocityOverTime
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
      ...new Vector3(0, 1, 0).toArray()
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
    spawn()

    const id = setInterval(() => {
      spawn()
    }, 200)

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
