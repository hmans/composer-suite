/* Re-export everything from Shader Composer */
export * from "shader-composer"

/* Patch units with Three.js specific code */
import { CameraFar, CameraNear, Resolution } from "shader-composer"
import * as THREE from "three"

export type UpdatePayload = {
  camera: THREE.Camera
  gl: THREE.WebGLRenderer
  scene: THREE.Scene
}

CameraNear._unitConfig.update = (_, { camera }: UpdatePayload) => {
  if (camera instanceof THREE.PerspectiveCamera) {
    CameraNear.value = camera.near
  }
}

CameraFar._unitConfig.update = (_, { camera }: UpdatePayload) => {
  if (camera instanceof THREE.PerspectiveCamera) {
    CameraFar.value = camera.far
  }
}

Resolution._unitConfig.update = (_, { gl }: UpdatePayload) => {
  Resolution.value.x = gl.domElement.width
  Resolution.value.y = gl.domElement.height
}
