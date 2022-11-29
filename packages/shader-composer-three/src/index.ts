/* Re-export everything from Shader Composer */
export * from "shader-composer"

/* Patch units with Three.js specific code */
import { CameraFar, CameraNear } from "shader-composer"
import { PerspectiveCamera } from "three"

CameraNear._unitConfig.update = (_, { camera }) => {
  if (camera instanceof PerspectiveCamera) {
    CameraNear.value = camera.near
  }
}

CameraFar._unitConfig.update = (_, { camera }) => {
  if (camera instanceof PerspectiveCamera) {
    CameraFar.value = camera.far
  }
}
