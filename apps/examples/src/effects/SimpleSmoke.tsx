import { Emitter, MeshParticles, ParticlesMaterial } from "@hmans/vfx"
import { GroupProps } from "@react-three/fiber"
import { between } from "randomish"
import { Vector3 } from "three"

const gravity = new Vector3(0, -9.81, 0)
const direction = new Vector3()

const SimpleSmoke = (props: GroupProps) => (
  <group {...props} scale={0.2}>
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
      <sphereBufferGeometry args={[1, 8, 4]} />
      <ParticlesMaterial color="white" />

      <Emitter
        initialDelay={0.1}
        spawnCount={() => between(5, 10)}
        burstCount={10}
        burstDelay={0.025}
        setup={({ position, velocity, acceleration }) => {
          direction.randomDirection()

          position.copy(direction).multiplyScalar(between(0.5, 3))

          velocity.copy(direction).multiplyScalar(between(5, 10))

          acceleration
            .copy(direction)
            .multiplyScalar(between(0, 5))
            .add(gravity)
        }}
      />
    </MeshParticles>
  </group>
)

export default SimpleSmoke
