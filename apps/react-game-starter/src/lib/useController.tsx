import { Controller } from "@hmans/controlfreak"
import { useFrame } from "@react-three/fiber"
import { useLayoutEffect } from "react"

export const useController = (controller: Controller) => {
  useLayoutEffect(() => {
    controller.start()
    return () => controller.stop()
  }, [controller])

  useFrame(() => {
    controller.update()
  })
}
