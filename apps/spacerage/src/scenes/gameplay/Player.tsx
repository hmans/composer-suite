import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import {
  ConvexHullCollider,
  interactionGroups,
  RigidBody,
  RigidBodyApi
} from "@react-three/rapier"
import { AudioListener, PositionalAudio } from "audio-composer"
import { pipe } from "fp-ts/lib/function"
import { useInput } from "input-composer"
import { Input } from "input-composer/vanilla"
import { plusMinus } from "randomish"
import { useRef } from "react"
import { useStore } from "statery"
import { Mesh, Quaternion, Vector3 } from "three"
import { Stage } from "../../configuration"
import { useCapture } from "../../lib/useCapture"
import { spawnBullet } from "./Bullets"
import { spawnFireSound } from "./Sounds"
import { gameplayStore, Layers } from "./state"

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
  const rb = useRef<RigidBodyApi>(null!)
  const gltf = useGLTF("/models/spaceship25.gltf")
  const getInput = useInput()
  const { player } = useStore(gameplayStore)
  const fireCooldown = useRef(0)

  useFrame(function playerUpdate(_, dt) {
    if (!player) return

    const input = pipe(getInput(), transformInput)

    const body = rb.current.raw()

    body.resetForces(true)
    body.resetTorques(true)
    player.getWorldQuaternion(tmpQuat)

    /* Rotate the player */
    body.addTorque(tmpVec3.set(0, 0, input.aim.x * -50), true)

    /* Thrust */
    const thrust = tmpVec3.set(input.move.x * 100, input.move.y * 100, 0)
    body.addForce(thrust, true)
  }, Stage.Early)

  useFrame(function playerShootingUpdate(_, dt) {
    if (!player) return
    const body = rb.current.raw()

    /* Fire? */
    fireCooldown.current -= dt

    const input = pipe(getInput(), transformInput)

    if (input.fire && fireCooldown.current <= 0) {
      const worldPosition = player.getWorldPosition(new Vector3())

      spawnFireSound({ position: worldPosition })

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
  }, Stage.Normal)

  return (
    <RigidBody
      ref={rb}
      angularDamping={3}
      linearDamping={1}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
      scale={0.5}
    >
      <group ref={useCapture(gameplayStore, "player")}>
        <ConvexHullCollider
          args={[
            (gltf.scene.children[0] as Mesh).geometry.attributes.position
              .array as Float32Array
          ]}
          collisionGroups={interactionGroups(Layers.Player, Layers.Asteroid)}
        />
        <primitive object={gltf.scene} />

        <PositionalAudio url="/sounds/taikobeat.mp3" loop autoplay />

        <AudioListener />
      </group>
    </RigidBody>
  )
}
