import { useFrame } from "@react-three/fiber"
import { Quaternion, Vector3 } from "three"
import { useGameplayStore } from "../state"

const center = new Vector3()
const currentQuat = new Quaternion()
const targetQuat = new Quaternion()

export const CameraSystem = () => {
  const { cameraTarget } = useGameplayStore()

  useFrame(({ camera }, dt) => {
    if (!cameraTarget) return

    /* Move camera target back to screen center */
    cameraTarget.position.lerp(center, 0.1)

    /* Smoothly follow camera target */
    currentQuat.copy(camera.quaternion)
    camera.lookAt(cameraTarget.position)
    targetQuat.copy(camera.quaternion)
    camera.quaternion.slerpQuaternions(currentQuat, targetQuat, 0.1)
  })

  return null
}
