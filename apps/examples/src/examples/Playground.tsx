import { between, plusMinus } from "randomish"
import { useEffect, useRef } from "react"
import {
  CustomShaderMaterialMaster,
  pipe,
  Smoothstep,
  Vec3,
  VertexPosition
} from "shader-composer"
import { Color, InstancedMesh, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import {
  AnimateScale,
  AnimateStatelessAcceleration,
  AnimateStatelessVelocity,
  ControlParticleLifetime,
  ParticleAttribute,
  ParticleProgress,
  useParticles
} from "vfx-composer"

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
          ParticleAttribute(
            "vec3",
            () => new Vector3(plusMinus(4), between(5, 20), plusMinus(4))
          )
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
