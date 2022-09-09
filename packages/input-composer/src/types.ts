import { Event } from "./lib/event"

export interface IVector {
  x: number
  y: number
}

export interface IDriver<D extends IDevice> {
  /** Start the driver. */
  start: () => void

  /** Stop the driver. */
  stop: () => void

  /**
   * Update the driver. Must be called by the user, every time
   * driver input is about to be queried (eg. once per frame.)
   */
  update: () => void

  onDeviceAppeared: Event<D>
  onDeviceDisappeared: Event<D>
  onDeviceActivity: Event<D>
}

export interface IDevice {
  update: () => void
  onActivity: Event
}
