import { Quaternion, Vector3 } from "three"
import { ECS } from "../state"
import { DebrisEmitter } from "../vfx/Debris"

export const spawnDebris = (position: Vector3, quaternion: Quaternion) => {
  ECS.world.createEntity({
    age: 0,
    destroyAfter: 3,
    debris: <DebrisEmitter position={position} quaternion={quaternion} />
  })
}
