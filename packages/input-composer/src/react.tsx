import { useFrame } from "@react-three/fiber"
import { useEffect } from "react"
import { AbstractController } from "./AbstractController"

export const useController = (
  controller: AbstractController,
  renderPriority?: number
) => {
  useEffect(() => {
    controller.start()
    return () => controller.stop()
  })

  useFrame(() => {
    controller.update()
  }, renderPriority)
}

export const Controller = ({
  controller,
  updatePriority
}: {
  controller: AbstractController
  updatePriority?: number
}) => {
  useController(controller, updatePriority)
  return null
}
