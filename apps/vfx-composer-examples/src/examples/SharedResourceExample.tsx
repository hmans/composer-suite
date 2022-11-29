import { sharedResource } from "@hmans/things"
import { pipe } from "fp-ts/function"
import { composable, modules } from "material-composer-r3f"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import { $float, Add, GlobalTime, InstanceID, Mul, Sin } from "shader-composer"
import { RGBADepthPacking, Vector3 } from "three"
import {
  Emitter,
  InstancedParticles,
  InstancedParticlesProps
} from "vfx-composer-r3f"

export default function SharedResourceExample() {
  return (
    <group position-y={1.5}>
      <SharedBlobMaterial.Mount />
      <SharedBlobDepthMaterial.Mount />

      {/* Create a whole bunch of objects, all using the same materials */}
      {Array.from(Array(30)).map((_, i) => (
        <Blobs
          position={[plusMinus(10), plusMinus(4), between(-10, 0)]}
          rotation-z={plusMinus(Math.PI)}
          scale={upTo(4)}
          key={i}
        />
      ))}
    </group>
  )
}

const Blobs = (props: InstancedParticlesProps) => (
  <InstancedParticles
    capacity={1_000}
    safetyCapacity={0}
    castShadow
    receiveShadow
    {...props}
  >
    <sphereGeometry args={[0.08, 8, 4]} />
    <SharedBlobMaterial.Use />
    <SharedBlobDepthMaterial.Use attach="customDepthMaterial" />
    <Emitter
      rate={Infinity}
      limit={1000}
      setup={({ position, scale }) => {
        position.add(insideSphere() as Vector3)
        scale.multiplyScalar(between(0.5, 1.5))
      }}
    />
  </InstancedParticles>
)

const BlobMaterial = () => {
  const time = GlobalTime

  return (
    <composable.meshStandardMaterial
      color="#e63946"
      metalness={0.5}
      roughness={0.6}
    >
      <modules.Translate offset={[1, 0, 0]} />
      <modules.Scale
        scale={pipe(
          $float(InstanceID),
          (v) => Add(time, v),
          (v) => Sin(v),
          (v) => Mul(v, 0.2),
          (v) => Add(v, 1)
        )}
      />
    </composable.meshStandardMaterial>
  )
}

const BlobDepthMaterial = () => {
  const time = GlobalTime

  return (
    <composable.meshDepthMaterial depthPacking={RGBADepthPacking}>
      <modules.Translate offset={[1, 0, 0]} />
      <modules.Scale
        scale={pipe(
          $float(InstanceID),
          (v) => Add(time, v),
          (v) => Sin(v),
          (v) => Mul(v, 0.2),
          (v) => Add(v, 1)
        )}
      />
    </composable.meshDepthMaterial>
  )
}

const SharedBlobMaterial = sharedResource(BlobMaterial)
const SharedBlobDepthMaterial = sharedResource(BlobDepthMaterial)
