/* Re-export everything from Shader Composer */
export * from "shader-composer"

/* Patch units with Three.js specific code */
import * as SC from "shader-composer"
import * as THREE from "three"

export type UpdatePayload = {
  camera: THREE.Camera
  gl: THREE.WebGLRenderer
  scene: THREE.Scene
}

SC.CameraNear._unitConfig.update = (_, { camera }: UpdatePayload) => {
  if (camera instanceof THREE.PerspectiveCamera) {
    SC.CameraNear.value = camera.near
  }
}

SC.CameraFar._unitConfig.update = (_, { camera }: UpdatePayload) => {
  if (camera instanceof THREE.PerspectiveCamera) {
    SC.CameraFar.value = camera.far
  }
}

SC.Resolution._unitConfig.update = (_, { gl }: UpdatePayload) => {
  SC.Resolution.value.x = gl.domElement.width
  SC.Resolution.value.y = gl.domElement.height
}

SC.UsingInstancing._unitConfig.value = SC.$`
  #ifdef USE_INSTANCING
    true
  #else
    false
  #endif
`
