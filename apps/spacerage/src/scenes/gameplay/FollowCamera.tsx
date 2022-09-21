import { useFrame } from "@react-three/fiber"
import { useStore } from "statery"
import { Vector3 } from "three"
import { Stage } from "../../configuration"
import { store } from "../../state"
import { gameplayStore } from "./state"

const offset = new Vector3(0, 0, 10)
const tmpVec3 = new Vector3()

export const FollowCamera = () => {
  const { player } = useStore(gameplayStore)
  const { camera } = useStore(store)

  useFrame(() => {
    if (camera && player) {
      player.getWorldPosition(tmpVec3)
      camera.lookAt(tmpVec3)
      camera.position.lerp(tmpVec3.add(offset), 0.1)
    }
  }, Stage.Late)

  return null
}
