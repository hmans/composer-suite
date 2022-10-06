import { AbstractControl } from "./controls/AbstractControl"
import { Scheme } from "./Scheme"

export interface IController {
  controls: Record<string, AbstractControl>
  schemes: Record<string, Scheme<any>>
}

export abstract class AbstractController implements IController {
  abstract controls: Record<string, AbstractControl>
  abstract schemes: Record<string, Scheme<any>>

  scheme: Scheme<any> | undefined

  process() {}

  start() {
    Object.values(this.schemes).forEach((s) => s.start())
  }

  stop() {
    Object.values(this.schemes).forEach((s) => s.stop())
  }

  update() {
    /* Update all schemes */
    Object.values(this.schemes).forEach((s) => s.update())

    /* Update active scheme */
    this.scheme?.process(this.scheme.devices)

    /* Process controls */
    this.process()

    /* Update control events */
    Object.values(this.controls).forEach((c) => c.update())
  }
}
