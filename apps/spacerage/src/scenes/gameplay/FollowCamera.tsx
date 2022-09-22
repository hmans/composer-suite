import { useFrame } from "@react-three/fiber"
import { useEffect } from "react"
import { useStore } from "statery"
import { Vector3 } from "three"
import { Stage } from "../../configuration"
import { store } from "../../state"
import { gameplayStore } from "./state"

const offset = new Vector3(0, 0, 40)
const playerPos = new Vector3()
const tmpVec3 = new Vector3()

export const FollowCamera = () => {
  const { player } = useStore(gameplayStore)
  const { camera } = useStore(store)

  useEffect(() => {
    if (camera) camera.quaternion.set(0, 0, 0, 1)
  }, [camera])

  useFrame((_, dt) => {
    if (camera && player) {
      player.getWorldPosition(playerPos)
      const cameraTarget = tmpVec3.copy(playerPos).add(offset)
      camera.position.lerp(cameraTarget, 2 * dt)
    }
  }, Stage.Late)

  return null
}
