import { Event } from "../lib/event"

export abstract class AbstractDevice {
  onActivity = new Event()

  abstract start(): void
  abstract stop(): void
  abstract update(): void
}
