import { RigidBody, RigidBodyEntity, RigidBodyProps } from "@hmans/physics3d"
import { forwardRef } from "react"
import { GLTFAsset } from "../../common/GLTFAsset"

export const Asteroid = forwardRef<RigidBodyEntity, RigidBodyProps>(
  (props, ref) => {
    return (
      <RigidBody
        ref={ref}
        angularDamping={1}
        linearDamping={1}
        enabledTranslations={[true, true, false]}
        enabledRotations={[true, true, true]}
        {...props}
      >
        <mesh>
          <boxGeometry />
          <meshBasicMaterial />
        </mesh>
        <GLTFAsset url="/models/asteroid03.gltf" />
      </RigidBody>
    )
  }
)
