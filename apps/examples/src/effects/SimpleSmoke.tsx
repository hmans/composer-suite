import {
  Emitter,
  MeshParticles,
  MeshParticlesProps,
  ParticlesAPI,
  ParticlesMaterial
} from "@hmans/vfx"
import { useRef } from "react"

export default (props: MeshParticlesProps) => {
  const ref = useRef<ParticlesAPI>(null!)

  return (
    <>
      <MeshParticles {...props} scale={0.2} ref={ref}>
        <ParticlesMaterial color="white" />
        <sphereBufferGeometry args={[1, 8, 8]} />

        <Emitter spawnCount={3} burstCount={10} burstDelay={0.025} />
      </MeshParticles>
    </>
  )
}
