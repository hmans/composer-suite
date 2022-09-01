import { GroupProps } from "@react-three/fiber"
import gsap from "gsap"
import { Euler, Quaternion } from "three"
import { Animate, AnimationFunction } from "../../lib/Animate"
import { Effect } from "../../lib/Effect"
import { Keypress } from "../../lib/Keypress"
import { Delay } from "../../lib/timeline-composer"
import { returnToTitle } from "../../state"
import Court from "./Court"
import { Ball, Enemy, Player } from "./entities"
import { ScoreHUD } from "./ScoreHUD"
import {
  MatchState,
  resetRound,
  setGameObject,
  startPlaying,
  store
} from "./state"
import { Systems } from "./systems/Systems"
import { BallImpactEffect } from "./vfx/BallImpact"
import { BallTrailEffect } from "./vfx/BallTrail"

const tmpQuat = new Quaternion()
const tmpEuler = new Euler()

const tiltWithBall: AnimationFunction = (dt, object) => {
  /* We can't afford to do this reactively here, will tweak later... */
  const ball = store.state.ball

  const target = tmpQuat.setFromEuler(
    ball
      ? tmpEuler.set(ball.position.y / -30, ball.position.x / 60, 0)
      : tmpEuler.set(0, 0, 0)
  )

  object.quaternion.slerp(target, 0.07)
}

const BallIntroAnimation = (props: GroupProps) => {
  return (
    <Animate
      init={(o) => {
        gsap.from(o.position, { y: -8, duration: 0.5 })
        gsap.from(o.scale, { x: 0, y: 0, z: 0, duration: 0.5 })
      }}
      {...props}
    />
  )
}

export const GameplayScene = () => (
  <group>
    <Keypress code="Escape" onPress={returnToTitle} />

    <Animate update={tiltWithBall}>
      <Court position-z={-0.5} />
      <ScoreHUD position={[0, 3.5, 1]} />
      <Player />
      <Enemy />

      <BallTrailEffect />
      <BallImpactEffect />

      <MatchState state="intro">
        <Delay seconds={0.75}>
          <Effect callback={startPlaying} />
        </Delay>
      </MatchState>

      <MatchState state={["intro", "playing"]}>
        <group ref={setGameObject("ball")}>
          <BallIntroAnimation>
            <Ball />
          </BallIntroAnimation>
        </group>
      </MatchState>

      <MatchState state="goal">
        <Delay seconds={1}>
          <Effect callback={resetRound} />
        </Delay>
      </MatchState>
    </Animate>

    <Systems />
    <CameraTarget />
  </group>
)

const CameraTarget = ({ debug = false }) => (
  <group ref={setGameObject("cameraTarget")}>
    {debug && (
      <mesh>
        <planeGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    )}
  </group>
)
