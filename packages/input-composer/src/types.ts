export interface IVector {
  x: number
  y: number
}

export interface IDriver<D extends IDevice> {
  /** Start the driver. */
  start: () => void

  /** Stop the driver. */
  stop: () => void

  /** Update the driver. Will be called by the InputManager. */
  update: () => void
}

export interface IDevice {}
