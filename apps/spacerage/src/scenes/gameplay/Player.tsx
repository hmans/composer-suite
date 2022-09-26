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
import { plusMinus } from "randomish"
import { useRef } from "react"
import { useStore } from "statery"
import { Euler, Mesh, Quaternion, Vector3 } from "three"
import { clamp } from "three/src/math/MathUtils"
import { Stage } from "../../configuration"
import { useCapture } from "../../lib/useCapture"
import { gameplayStore, Layers, spawnBullet } from "./state"

const tmpVec3 = new Vector3()
const tmpQuat = new Quaternion()

let activeDevice: "keyboard" | "gamepad" = "gamepad"

const transformInput = ({ keyboard, gamepad }: Input) => ({
  move:
    activeDevice === "keyboard"
      ? keyboard.vector("KeyW", "KeyS", "KeyA", "KeyD")
      : gamepad.gamepad(0).vector(0, 1),

  aim:
    activeDevice === "keyboard"
      ? keyboard.vector("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight")
      : gamepad.gamepad(0).vector(2, 3),

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
    player.getWorldQuaternion(tmpQuat)

    /* Rotate the player */
    const lookDirection = new Vector3(0, 1, 0).applyQuaternion(tmpQuat)
    const aimDirection = new Vector3(input.aim.x, input.aim.y, 0).normalize()
    const angle = lookDirection.angleTo(aimDirection)
    const cross = lookDirection.cross(aimDirection)
    if (cross.z) {
      const delta = angle / Math.PI
      const torque = Math.sign(cross.z) * Math.pow(delta, 2) * 300
      body.addTorque(tmpVec3.set(0, 0, torque), true)
    }

    /* Thrust */
    const thrust = tmpVec3.set(input.move.x * 100, input.move.y * 100, 0)

    body.addForce(thrust, true)
  }, Stage.Early)

  useFrame((_, dt) => {
    if (!player) return
    const { body } = rb.current

    /* Fire? */
    fireCooldown.current -= dt

    const input = pipe(getInput(), transformInput)

    if (input.fire && fireCooldown.current <= 0) {
      spawnBullet(
        player
          .getWorldPosition(new Vector3())
          .add(new Vector3(-1.3, 0.5, 0).applyQuaternion(tmpQuat)),
        tmpQuat,

        new Vector3(0, 40, 0)
          .applyQuaternion(tmpQuat)
          .applyAxisAngle(new Vector3(0, 0, 1), plusMinus(0.02))
          .add(body.linvel() as Vector3)
      )

      spawnBullet(
        player
          .getWorldPosition(new Vector3())
          .add(new Vector3(+1.3, 0.5, 0).applyQuaternion(tmpQuat)),

        tmpQuat,

        new Vector3(0, 40, 0)
          .applyQuaternion(tmpQuat)
          .applyAxisAngle(new Vector3(0, 0, 1), plusMinus(0.02))
          .add(body.linvel() as Vector3)
      )

      fireCooldown.current = 0.065
    }
  })

  return (
    <RigidBody
      ref={rb}
      angularDamping={3}
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
