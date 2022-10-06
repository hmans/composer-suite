import { AbstractDevice } from "./devices/AbstractDevice"
import { Event } from "./lib/event"

export type DeviceMap = { [key: string]: AbstractDevice }

export class Scheme<D extends DeviceMap> {
  onActivity = new Event()

  constructor(public devices: D, public updateFun: (devices: D) => void) {
    this.updateFun = updateFun.bind(this)

    Object.values(devices).forEach((device) => {
      device.onActivity.addListener(() => {
        this.onActivity.emit()
      })
    })
  }

  start() {
    Object.values(this.devices).forEach((d) => d.start())
  }

  stop() {
    Object.values(this.devices).forEach((d) => d.stop())
  }

  update() {
    /* Update devices */
    Object.values(this.devices).forEach((d) => d.update())

    /* Execute update function */
    this.updateFun?.(this.devices)
  }
}
