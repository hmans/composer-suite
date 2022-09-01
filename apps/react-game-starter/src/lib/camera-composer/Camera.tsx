import { useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import { PerspectiveCamera } from "three"

export function Camera() {
  const camera = useRef<PerspectiveCamera>(null!)
  const set = useThree(({ set }) => set)
  const size = useThree(({ size }) => size)

  /* Adjust the camera's aspect ratio to match the canvas. */
  useLayoutEffect(() => {
    if (!camera.current) return
    camera.current.aspect = size.width / size.height
  }, [size])

  /* Set the camera as the active camera */
  useLayoutEffect(() => {
    if (!camera.current) return
    set({ camera: camera.current })
  }, [set, camera])

  return <perspectiveCamera ref={camera} position={[0, 0, 20]} />
}
