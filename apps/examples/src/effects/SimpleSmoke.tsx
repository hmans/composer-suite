import { Emitter, MeshParticles, ParticlesMaterial } from "@hmans/vfx"
import { GroupProps } from "@react-three/fiber"
import { between, plusMinus } from "randomish"
import { Vector3 } from "three"

const gravity = new Vector3(0, -9.81, 0)
const direction = new Vector3()

const SimpleSmoke = (props: GroupProps) => (
  <group {...props} scale={0.2}>
    {/* Smoke Ring */}
    <MeshParticles>
      <sphereBufferGeometry args={[1, 8, 8]} />
      <ParticlesMaterial color="white" />

      <Emitter
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

    {/* Fire */}
    <MeshParticles scale={0.5}>
      <boxGeometry />
      <ParticlesMaterial color="red" />

      <Emitter
        spawnCount={() => between(5, 15)}
        burstCount={10}
        burstDelay={0.01}
        setup={({ position, velocity }) => {
          position.randomDirection().multiplyScalar(between(0.5, 3))
          velocity.randomDirection().multiplyScalar(between(1, 2))
        }}
      />
    </MeshParticles>

    {/* Smoke */}
    <MeshParticles>
      <sphereBufferGeometry args={[1, 8, 8]} />
      <ParticlesMaterial color="#888" />

      <Emitter
        initialDelay={0.2}
        spawnCount={() => between(5, 10)}
        burstCount={10}
        burstDelay={0.025}
        setup={({ position, velocity, acceleration, scaleStart, scaleEnd }) => {
          direction.randomDirection()

          position.copy(direction).multiplyScalar(between(0.5, 3))

          velocity.copy(direction).multiplyScalar(between(5, 10))

          acceleration
            .randomDirection()
            .multiplyScalar(between(0, 3))
            .add(direction.clone().multiplyScalar(-between(3, 8)))

          scaleStart.setScalar(between(0.5, 1))
          scaleEnd.setScalar(between(2, 3))
        }}
      />
    </MeshParticles>
  </group>
)

export default SimpleSmoke
