import { between, plusMinus } from "randomish"
import { useEffect, useRef } from "react"
import {
  CustomShaderMaterialMaster,
  OneMinus,
  pipe,
  VertexPosition
} from "shader-composer"
import { Color, InstancedMesh, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import {
  AccelerationModule,
  LifetimeModule,
  ParticleAttribute,
  ParticleProgress,
  ScaleModule,
  useParticles,
  VelocityModule
} from "vfx-composer"

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, shader } = useParticles(imesh, () => {
    const velocity = ParticleAttribute(
      "vec3",
      () => new Vector3(plusMinus(3), between(5, 15), plusMinus(3))
    )

    const gravity = new Vector3(0, -9.81, 0)

    const modules = [
      LifetimeModule(),
      ScaleModule(OneMinus(ParticleProgress)),
      VelocityModule(velocity),
      AccelerationModule(gravity)
    ] as const

    const { color, position, alpha } = pipe(
      {
        color: new Color("hotpink"),
        position: VertexPosition,
        alpha: 1
      },
      ...modules
    )

    return CustomShaderMaterialMaster({
      position,
      diffuseColor: color,
      alpha
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
