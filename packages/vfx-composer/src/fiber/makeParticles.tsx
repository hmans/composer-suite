import { InstancedMeshProps, Object3DProps } from "@react-three/fiber"
import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react"
import { InstancedMesh, Matrix4, Object3D } from "three"
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

  /* EMITTER COMPONENT */
  const Emitter = forwardRef<Object3D, Object3DProps>((props, ref) => {
    const object = useRef<Object3D>(null!)

    useImperativeHandle(ref, () => object.current)

    useEffect(() => {
      spawn()
    }, [])

    return <object3D ref={object} {...props} />
  })

  return { Root, Emitter, spawn }
}
