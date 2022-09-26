import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody,
  RigidBodyEntity
} from "@hmans/physics3d"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { useInput } from "input-composer"
import { Input } from "input-composer/vanilla"
import { useRef } from "react"
import { useStore } from "statery"
import { Mesh, Quaternion, Vector3 } from "three"
import { Stage } from "../../configuration"
import { useCapture } from "../../lib/useCapture"
import { gameplayStore, Layers, spawnBullet } from "./state"

const tmpVec3 = new Vector3()
const tmpQuat = new Quaternion()

let activeDevice: "keyboard" | "gamepad" = "gamepad"

const transformInput = ({ keyboard, gamepad }: Input) => ({
  horizontal:
    activeDevice === "keyboard"
      ? keyboard.axis("KeyA", "KeyD")
      : gamepad.gamepad(0).axis(0),

  vertical:
    activeDevice === "keyboard"
      ? keyboard.axis("KeyS", "KeyW")
      : -gamepad.gamepad(0).axis(1),

  fire:
    activeDevice === "keyboard"
      ? keyboard.key("Space")
      : gamepad.gamepad(0).button(7)
})

export const Player = () => {
  const rb = useRef<RigidBodyEntity>(null!)

  const gltf = useGLTF("/models/spaceship25.gltf")

  const getInput = useInput()

  const { player } = useStore(gameplayStore)

  const fireCooldown = useRef(0)

  useFrame((_, dt) => {
    if (!player) return

    const input = pipe(getInput(), transformInput)

    const { body } = rb.current

    body.resetForces(true)
    body.resetTorques(true)

    /* Rotate the player */
    // body.addTorque(tmpVec3.set(0, 0, -40).multiplyScalar(horizontal), true)

    /* Thrust */
    const thrust = tmpVec3.set(input.horizontal * 100, input.vertical * 100, 0)

    body.addForce(thrust, true)

    /* Fire? */
    fireCooldown.current -= dt
    if (input.fire && fireCooldown.current <= 0) {
      player.getWorldQuaternion(tmpQuat)

      spawnBullet(
        player
          .getWorldPosition(new Vector3())
          .add(new Vector3(-1.3, 0.5, 0).applyQuaternion(tmpQuat)),
        tmpQuat
      )

      spawnBullet(
        player
          .getWorldPosition(new Vector3())
          .add(new Vector3(+1.3, 0.5, 0).applyQuaternion(tmpQuat)),
        tmpQuat
      )

      fireCooldown.current = 0.065
    }
  }, Stage.Early)

  return (
    <RigidBody
      ref={rb}
      angularDamping={1}
      linearDamping={1}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <group ref={useCapture(gameplayStore, "player")}>
        <group scale={0.5}>
          <ConvexHullCollider
            collisionGroups={interactionGroups(Layers.Player, Layers.Asteroid)}
            points={
              (gltf.scene.children[0] as Mesh).geometry.attributes.position
                .array as Float32Array
            }
          />
          <primitive object={gltf.scene} />
        </group>
      </group>
    </RigidBody>
  )
}
