import { useLayoutEffect, useRef } from "react"
import { Matrix4, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { Particles } from "three-vfx"

export default function ShadenfreudeParticles() {
  const imesh = useRef<Particles>(null!)

  useLayoutEffect(() => {
    /* Spawn a single particle */
    imesh.current.setMatrixAt(0, new Matrix4())
    imesh.current.count = 1
  }, [])

  return (
    <group position-y={15}>
      <Particles ref={imesh}>
        <sphereGeometry />
        <CustomShaderMaterial baseMaterial={MeshStandardMaterial} />
      </Particles>
    </group>
  )
}
