import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect
} from "react"
import { InstancedMesh, Matrix4 } from "three"

export type ParticlesProps = InstancedMeshProps

export type Particles = {
  mesh: InstancedMesh
}

export const makeParticles = () => {
  const Root = forwardRef<Particles, ParticlesProps>((props, ref) => {
    const mesh = useRef<InstancedMesh>(null!)

    useImperativeHandle(ref, () => ({
      mesh: mesh.current
    }))

    useEffect(() => {
      mesh.current.setMatrixAt(0, new Matrix4())
      mesh.current.count = 1
      mesh.current.instanceMatrix.needsUpdate = true
    }, [])

    return (
      <instancedMesh
        args={[undefined, undefined, 1000]}
        {...props}
        ref={mesh}
      />
    )
  })

  return {
    Root
  }
}
