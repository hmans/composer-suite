import { Emitter, MeshParticles, ParticlesMaterial } from "@hmans/vfx"
import { GroupProps } from "@react-three/fiber"
import { between, plusMinus } from "randomish"
import { Vector3 } from "three"

const gravity = new Vector3(0, -9.81, 0)
const direction = new Vector3()

const SmokeRing = ({ delay = 0 }) => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial color="white" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => between(25, 40)}
      burstCount={5}
      burstDelay={0.025}
      setup={({ position, velocity, acceleration, scaleStart, scaleEnd }) => {
        direction
          .set(1, 0, 0)
          .applyAxisAngle(new Vector3(0, 1, 0), between(0, Math.PI * 2))

        position.copy(direction).multiplyScalar(3 + plusMinus(0.2))

        velocity.copy(direction).multiplyScalar(10 + plusMinus(3))

        acceleration.copy(direction).multiplyScalar(-3)

        scaleStart.setScalar(1 + plusMinus(0.3))
        scaleEnd.setScalar(0)
      }}
    />
  </MeshParticles>
)

const Fire = ({ delay = 0 }) => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial color="red" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => between(20, 50)}
      setup={({ position, velocity, scaleStart, scaleEnd }) => {
        direction.randomDirection()
        position.copy(direction).multiplyScalar(between(0, 2))
        velocity.copy(direction).multiplyScalar(between(2, 4))
        scaleStart.setScalar(between(0, 2))
        scaleEnd.setScalar(3 + Math.pow(Math.random(), 3))
      }}
    />
  </MeshParticles>
)

const SmokeCloud = ({ delay = 0 }) => (
  <MeshParticles>
    <sphereBufferGeometry args={[1, 8, 8]} />
    <ParticlesMaterial color="#888" />

    <Emitter
      initialDelay={delay}
      spawnCount={() => between(5, 10)}
      burstCount={3}
      burstDelay={0.03}
      setup={({ position, velocity, acceleration, scaleStart, scaleEnd }) => {
        direction.randomDirection()

        position.copy(direction).multiplyScalar(between(0.5, 3))

        velocity
          .copy(direction)
          .multiplyScalar(between(2, 5))
          .add(new Vector3(0, between(2, 3), 0))

        acceleration
          .randomDirection()
          .multiplyScalar(between(0, 3))
          .add(direction.clone().multiplyScalar(-between(2, 5)))

        scaleStart.setScalar(between(0.5, 1))
        scaleEnd.setScalar(between(3, 6))
      }}
    />
  </MeshParticles>
)

const SimpleSmoke = (props: GroupProps) => (
  <group {...props} scale={0.2}>
    <SmokeRing />
    <Fire />
    <SmokeCloud delay={0.4} />
  </group>
)

export default SimpleSmoke
