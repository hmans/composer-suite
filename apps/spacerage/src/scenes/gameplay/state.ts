import { makeStore } from "statery"
import { Object3D } from "three"

export const gameplayStore = makeStore({
  player: null as Object3D | null
})
