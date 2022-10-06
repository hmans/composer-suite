import { AbstractDevice } from "./devices/AbstractDevice"
import { Event } from "./lib/event"

export type DeviceMap = { [key: string]: AbstractDevice }

export class Scheme {
  onActivity = new Event()

  constructor(public devices: DeviceMap, public update: () => void) {
    this.update = update.bind(this)

    Object.values(devices).forEach((device) => {
      device.onActivity.addListener(() => {
        this.onActivity.emit()
      })
    })
  }
}
