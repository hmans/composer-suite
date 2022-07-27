import { MutableRefObject, useEffect, useLayoutEffect, useRef } from "react"
import {
  $,
  Add,
  CustomShaderMaterialMaster,
  Float,
  GLSLType,
  Time,
  Uniform,
  Unit,
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

const Attribute = (type: GLSLType, name: string) =>
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
  const effectAgeUniform = Uniform("float", 0)

  const effectAge = Float(effectAgeUniform, {
    update: (dt) => (effectAgeUniform.value += dt)
  })

  // const EffectAge = Attribute("float", "effectAge")

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
      effectAgeUniform.value,
      effectAgeUniform.value + 1
    )

    /* Make up a velocity */
    geometry.attributes.velocity.setXYZ(
      cursor,
      ...new Vector3().randomDirection().toArray()
    )

    /* Advance cursor */
    cursor = (cursor + 1) % imesh.current.count

    imesh.current.instanceMatrix.needsUpdate = true
  }

  const color = Vec3(new Color("hotpink"))

  const position = Add(VertexPosition, effectAge)

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
