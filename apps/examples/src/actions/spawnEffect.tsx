import { Tag } from "miniplex"
import { Vector3 } from "three"
import ECS from "../ECS"

export default (position: Vector3) => {
  ECS.world.createEntity({
    isEffect: Tag,
    spawn: { position },
    age: 0,
    maxAge: 5
  })
}
