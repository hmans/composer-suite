import { AbstractDevice } from "./devices/AbstractDevice"

export class Scheme {
  constructor(public devices: AbstractDevice[], public update: () => void) {
    this.update = update.bind(this)
  }
}
