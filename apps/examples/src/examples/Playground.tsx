import { between } from "randomish"
import { useEffect, useRef } from "react"
import { CustomShaderMaterialMaster, OneMinus } from "shader-composer"
import { InstancedMesh, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import {
  AccelerationModule,
  LifetimeModule,
  modularPipe,
  ParticleProgress,
  ScaleModule,
  useParticles,
  VelocityModule
} from "vfx-composer"

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, shader } = useParticles(imesh, () => {
    const { color, position, alpha } = modularPipe(
      LifetimeModule(),
      ScaleModule(OneMinus(ParticleProgress)),
      VelocityModule(new Vector3(0, 15, 0)),
      AccelerationModule(new Vector3(0, -9.81, 0))
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
