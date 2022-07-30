import { InstancedMeshProps } from "@react-three/fiber"
import { Instance } from "@react-three/fiber/dist/declarations/src/core/renderer"
import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { InstancedMesh, Matrix4 } from "three"
import { ModulePipe } from "../modules"

export const makeParticles = (modules: ModulePipe = []) => {
  const imesh = createRef<InstancedMesh>()

  const spawn = () => {
    imesh.current!.setMatrixAt(0, new Matrix4())
  }

  /* ROOT COMPONENT */
  const Root = forwardRef<InstancedMesh, InstancedMeshProps>((props, ref) => {
    useImperativeHandle(ref, () => imesh.current!)

    return (
      <instancedMesh
        args={[undefined, undefined, 10000]}
        ref={imesh}
        {...props}
      />
    )
  })

  return { Root, spawn }
}
