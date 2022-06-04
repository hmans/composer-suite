import {
  Emitter,
  MeshParticles,
  MeshParticlesProps,
  ParticlesMaterial
} from "@hmans/vfx"

export default (props: MeshParticlesProps) => (
  <MeshParticles {...props} scale={0.2}>
    <ParticlesMaterial color="white" />
    <sphereBufferGeometry args={[1, 8, 8]} />

    <Emitter spawnCount={3} burstCount={10} burstDelay={0.025} />
  </MeshParticles>
)
