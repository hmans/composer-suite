import { controller } from "./input/controller"
import { useController } from "./lib/useController"

export const Controller = () => {
  /* TODO: Combine this with the controler definition in controller.ts */
  /* Initialize and update game input */
  useController(controller)

  return null
}
