import { Environment } from "@react-three/drei"

export const Skybox = () => {
  return (
    <Environment
      background="only"
      files={[
        "/textures/skybox/right.png",
        "/textures/skybox/left.png",
        "/textures/skybox/top.png",
        "/textures/skybox/bottom.png",
        "/textures/skybox/front.png",
        "/textures/skybox/back.png"
      ]}
    />
  )
}
