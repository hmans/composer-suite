import { InstancedMeshProps } from "@react-three/fiber"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { InstancedMesh } from "three"

type ParticlesProps = InstancedMeshProps

type Particles = {
  mesh: InstancedMesh
}

const Particles = forwardRef<Particles, ParticlesProps>((props, ref) => {
  const mesh = useRef<InstancedMesh>(null!)

  useImperativeHandle(ref, () => ({
    mesh: mesh.current
  }))

  return <instancedMesh {...props} ref={mesh} />
})

export default function Playground() {
  return (
    <Particles>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </Particles>
  )
}
