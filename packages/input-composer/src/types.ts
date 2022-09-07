import { IEventCallback } from "./lib/event"

export interface IVector {
  x: number
  y: number
}

export type Driver = {
  start: () => void
  stop: () => void
  onDeviceAppeared: IEventCallback
  onDeviceDisappeared: IEventCallback
  onDeviceActivity: IEventCallback
}

export type Device = {}
