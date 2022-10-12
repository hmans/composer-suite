import { Vector3 } from "three"
import { Animate, AnimationFunction } from "../../../lib/Animate"
import { ballRadius } from "../configuration"
import { useGameplayStore } from "../state"
import { BallTrailEmitter } from "../vfx/BallTrail"

const rotate =
  (speed: Vector3): AnimationFunction =>
  (dt, { rotation }) => {
    rotation.x += speed.x * dt
    rotation.y += speed.y * dt
    rotation.z += speed.z * dt
  }

export const Ball = () => (
  <Animate update={rotate(useGameplayStore().ballRotation)}>
    <BallTrailEmitter />

    <mesh>
      <dodecahedronGeometry args={[ballRadius]} />
      <meshStandardMaterial color="white" metalness={0.2} roughness={0.1} />
    </mesh>
  </Animate>
)
