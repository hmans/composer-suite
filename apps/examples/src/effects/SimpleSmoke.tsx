import { Emitter, MeshParticles, ParticlesMaterial } from "@hmans/vfx"
import { GroupProps } from "@react-three/fiber"
import { between } from "randomish"
import { Vector3 } from "three"

const tmpPosition = new Vector3()
const tmpVelocity = new Vector3()

export default (props: GroupProps) => (
  <group {...props} scale={0.2}>
    {/* Fire */}
    <MeshParticles scale={0.5}>
      <boxGeometry />
      <ParticlesMaterial color="red" />

      <Emitter
        spawnCount={() => between(5, 15)}
        burstCount={10}
        burstDelay={0.01}
        position={() =>
          tmpPosition.randomDirection().multiplyScalar(between(0.5, 3))
        }
        velocity={() =>
          tmpVelocity.randomDirection().multiplyScalar(between(1, 2))
        }
      />
    </MeshParticles>

    {/* Smoke */}
    <MeshParticles>
      <sphereBufferGeometry args={[1, 8, 8]} />
      <ParticlesMaterial color="white" />

      <Emitter
        initialDelay={0.1}
        spawnCount={() => between(5, 10)}
        burstCount={10}
        burstDelay={0.025}
        position={() =>
          tmpPosition.randomDirection().multiplyScalar(between(0.5, 3))
        }
        velocity={() =>
          tmpVelocity.randomDirection().multiplyScalar(between(4, 8))
        }
      />
    </MeshParticles>
  </group>
)
