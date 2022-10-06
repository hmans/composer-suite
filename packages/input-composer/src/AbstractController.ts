import { AbstractControl } from "./controls/AbstractControl"
import { AbstractDevice } from "./devices/AbstractDevice"
import { Scheme } from "./Scheme"

export interface IController {
  devices: Record<string, AbstractDevice>
  controls: Record<string, AbstractControl>
  schemes: Record<string, Scheme>
}

export abstract class AbstractController implements IController {
  abstract devices: Record<string, AbstractDevice>
  abstract controls: Record<string, AbstractControl>
  abstract schemes: Record<string, Scheme>

  scheme: "gamepad" | "keyboard" = "gamepad"

  start() {
    Object.values(this.devices).forEach((d) => d.start())
  }

  stop() {
    Object.values(this.devices).forEach((d) => d.stop())
  }

  process() {}

  update() {
    /* Update devices */
    Object.values(this.devices).forEach((d) => d.update())

    /* Execute control scheme */
    this.schemes[this.scheme]?.update()

    /* Process controls */
    this.process()

    /* Update control events */
    Object.values(this.controls).forEach((c) => c.update())
  }
}
