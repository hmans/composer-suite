import { AbstractDevice } from "./devices/AbstractDevice"
import { Event } from "./lib/event"

export type DeviceMap = { [key: string]: AbstractDevice }

export class Scheme<D extends DeviceMap> {
  onActivity = new Event()

  constructor(public devices: D, public process: (devices: D) => void) {
    this.process = process.bind(this)

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
    Object.values(this.devices).forEach((d) => d.update())
  }
}
