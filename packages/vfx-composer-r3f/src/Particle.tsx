import { Object3DProps } from "@react-three/fiber"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { Object3D } from "three"
import { Emitter } from "./Emitter"

export const Particle = forwardRef<Object3D, Object3DProps>((props, ref) => {
  const sceneObject = useRef<Object3D>(null!)

  useImperativeHandle(ref, () => sceneObject.current)

  return (
    <object3D ref={sceneObject}>
      <Emitter limit={1} rate={Infinity} />
    </object3D>
  )
})
