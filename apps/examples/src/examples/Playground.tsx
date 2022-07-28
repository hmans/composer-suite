import { between } from "randomish"
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import {
  $,
  Add,
  Attribute,
  CustomShaderMaterialMaster,
  Div,
  Float,
  GLSLType,
  InstanceMatrix,
  isUnit,
  Item,
  JSTypes,
  Mat3,
  Mul,
  pipe,
  Pow,
  Smoothstep,
  SplitVector2,
  Sub,
  Uniform,
  Unit,
  Value,
  Vec3,
  VertexPosition,
  walkTree
} from "shader-composer"
import { useShader } from "shader-composer-r3f"
import {
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3
} from "three"
import CustomShaderMaterial from "three-custom-shader-material"

/*
collect helper
*/

const collect = (root: Item, check: (item: Item) => boolean) => {
  const found = new Array<Item>()

  walkTree(root, (item) => {
    if (check(item)) {
      found.push(item)
    }
  })

  return found
}

/*
Particle Attribute Unit
*/

type MeshSetupCallback = (mesh: InstancedMesh) => void

type ParticleAttribute<T extends GLSLType> = Unit<T> & {
  isParticleAttribute: true
  setupMesh: MeshSetupCallback
  setupParticle: (mesh: InstancedMesh, index: number) => void
}

const ParticleAttribute = <T extends GLSLType>(
  type: T,
  name: string,
  getParticleValue: () => JSTypes[T]
): ParticleAttribute<T> => ({
  ...Attribute(type, name),
  isParticleAttribute: true,

  setupMesh: ({ geometry, count }: InstancedMesh) => {
    const itemSize =
      type === "vec2" ? 2 : type === "vec3" ? 3 : type === "vec4" ? 4 : 4

    geometry.setAttribute(name, makeAttribute(count, itemSize))
  },

  setupParticle: ({ geometry }: InstancedMesh, index: number) => {
    console.log("hi from setupParticle")
    const value = getParticleValue()
    const attribute = geometry.attributes[name]

    if (value instanceof Vector3) {
      attribute.setXYZ(index, value.x, value.y, value.z)
    }

    attribute.needsUpdate = true
  }
})

function isParticleAttribute<T extends GLSLType>(
  item: Unit<T>
): item is ParticleAttribute<T> {
  return isUnit(item) && "isParticleAttribute" in item
}

/*
SHADER UNITS
*/

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

/*
HOOKS
*/

/**
 * Prepares the given instanced mesh and returns an API for interacting with it.
 */
const useParticles = (
  imesh: MutableRefObject<InstancedMesh>,
  masterFun: () => Unit
) => {
  const master = useMemo(masterFun, [])
  const attributeUnits = useRef<ParticleAttribute<any>[]>([])

  /* Create attributes on the geometry */
  useLayoutEffect(() => {
    /* Prepare geometry */
    const { geometry, count } = imesh.current

    geometry.setAttribute("lifetime", makeAttribute(count, 2))

    attributeUnits.current = collect(master, isParticleAttribute)

    for (const unit of attributeUnits.current) {
      unit.setupMesh(imesh.current)
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

      /* Genererate values for per-particle attributes */
      for (const unit of attributeUnits.current) {
        unit.setupParticle(imesh.current, cursor)
      }

      /* Advance cursor */
      cursor = (cursor + 1) % imesh.current.count

      imesh.current.instanceMatrix.needsUpdate = true
    }
  }

  const shader = useShader(() => master)

  return { spawn, shader }
}

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, shader } = useParticles(imesh, () =>
    CustomShaderMaterialMaster({
      diffuseColor: pipe(Vec3(new Color("hotpink")), ControlParticleLifetime),

      position: pipe(
        /* Start with the original vertex position */
        VertexPosition,

        /* Animate the scale! Let's go all smoothsteppy! */
        AnimateScale(Smoothstep(0, 0.5, ParticleProgress)),

        /* We can layer multiple of these! */
        AnimateScale(Smoothstep(1.0, 0.8, ParticleProgress)),

        /* Gravity! */
        AnimateStatelessAcceleration(new Vector3(0, -10, 0)),

        /* Also animate velocity, sourcing per-particle velocity from a buffer attribute */
        AnimateStatelessVelocity(
          ParticleAttribute("vec3", "velocity", () => {
            console.log("YOOOO")
            return new Vector3(5, 40, 0)
          })
        )
      )
    })
  )

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
