import { IEventCallback } from "./lib/event"

export interface IVector {
  x: number
  y: number
}

export type Driver<D = undefined> = {
  start: () => void
  stop: () => void
  update: () => void
  onDeviceAppeared: IEventCallback<D>
  onDeviceDisappeared: IEventCallback<D>
  onDeviceActivity: IEventCallback<D>
}

export type Device = {}
