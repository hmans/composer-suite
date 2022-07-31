import { Object3DProps } from "@react-three/fiber"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { Object3D } from "three"

export type EmitterProps = Object3DProps & {
  count?: number
  continuous?: boolean
}

export const Emitter = forwardRef<Object3D, EmitterProps>(
  ({ count = 0, continuous = false, ...props }, ref) => {
    const object = useRef<Object3D>(null!)

    // useEffect(() => {
    //   if (continuous) return
    //   spawn(count, { setup })
    // }, [])

    // useFrame(() => {
    //   if (continuous) {
    //     spawn(count, { setup })
    //   }
    // })

    useImperativeHandle(ref, () => object.current)

    return <object3D {...props} ref={object} />
  }
)
