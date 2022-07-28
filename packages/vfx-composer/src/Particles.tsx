import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  createRef
} from "react"
import { InstancedMesh, Matrix4 } from "three"

export type ParticlesProps = InstancedMeshProps

export type Particles = {
  mesh: InstancedMesh
}

export const makeParticles = () => {
  const imesh = createRef<InstancedMesh>()

  const spawn = () => {
    if (!imesh.current)
      throw new Error("Particles mesh not created, can't spawn particle!")

    imesh.current.setMatrixAt(0, new Matrix4())
    imesh.current.count = 1
    imesh.current.instanceMatrix.needsUpdate = true
  }

  const Root = forwardRef<Particles, ParticlesProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
      mesh: imesh.current!
    }))

    return (
      <instancedMesh
        args={[undefined, undefined, 1000]}
        {...props}
        ref={imesh}
      />
    )
  })

  return {
    Root,
    spawn
  }
}
