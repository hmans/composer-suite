import { Tag } from "miniplex"
import { createECS } from "miniplex-react"
import { Vector3 } from "three"

type Entity = {
  isEffect: Tag
  age?: number
  maxAge?: number
  spawn: {
    position: Vector3
  }
}

export default createECS<Entity>()
