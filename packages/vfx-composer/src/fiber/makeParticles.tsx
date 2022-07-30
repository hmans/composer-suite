import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { InstancedMesh, Matrix4 } from "three"
import { ModulePipe } from "../modules"

export const makeParticles = (modules: ModulePipe = []) => {
  /* ROOT COMPONENT */
  const Root = forwardRef<InstancedMesh, InstancedMeshProps>((props, ref) => {
    const imesh = useRef<InstancedMesh>(null!)

    useEffect(() => {
      imesh.current.setMatrixAt(0, new Matrix4())
    }, [])

    useImperativeHandle(ref, () => imesh.current)

    return (
      <instancedMesh
        args={[undefined, undefined, 10000]}
        ref={imesh}
        {...props}
      />
    )
  })

  return { Root }
}
