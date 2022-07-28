import { between } from "randomish"
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
  LifetimeModule,
  ParticleProgress,
  ScaleModule,
  useParticles,
  VelocityModule
} from "vfx-composer"

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, shader } = useParticles(imesh, () => {
    const modules = [
      LifetimeModule(),
      ScaleModule(OneMinus(ParticleProgress)),
      VelocityModule(new Vector3(0, 10, 0))
    ] as const

    const { color, position } = pipe(
      {
        color: new Color("hotpink"),
        position: VertexPosition
      },
      ...modules
    )

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
