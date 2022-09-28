import { makeStore } from "statery"
import * as THREE from "three"

export const store = makeStore({
  listener: null as THREE.AudioListener | null
})
