import { composable, modules } from "material-composer-r3f"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import {
  $,
  Add,
  Float,
  Input,
  Int,
  Mul,
  pipe,
  Sin,
  Time,
  vec3
} from "shader-composer"
import { RGBADepthPacking, Vector3 } from "three"
import { Emitter, Particles, ParticlesProps } from "vfx-composer-r3f"
import { sharedResource } from "./lib/sharedResource"

// TODO: extract to Shader Composer
export const float = (v: Input<"float" | "bool" | "int">) =>
  Float($`float(${v})`)

// TODO: extract to Shader Composer
const InstanceID = Int($`gl_InstanceID`, { only: "vertex" })

export default function SharedResourceExample() {
  return (
    <group position-y={1.5}>
      <SharedBlobMaterial.Mount />
      <SharedBlobDepthMaterial.Mount />

      {/* Create a whole bunch of objects, all using the same materials */}
      {Array.from(Array(30)).map((_, i) => (
        <Blobs
          position={[plusMinus(10), upTo(4), between(-10, 0)]}
          rotation-z={plusMinus(Math.PI)}
          scale={upTo(4)}
          key={i}
        />
      ))}
    </group>
  )
}

const Blobs = (props: ParticlesProps) => (
  <Particles
    maxParticles={1_000}
    safetyBuffer={0}
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
  </Particles>
)

const BlobMaterial = () => {
  const time = Time()

  return (
    <composable.MeshStandardMaterial
      color="#e63946"
      metalness={0.5}
      roughness={0.6}
    >
      <modules.Translate offset={vec3(1, 0, 0)} space="local" />
      <modules.Scale
        scale={pipe(
          float(InstanceID),
          (v) => Add(time, v),
          (v) => Sin(v),
          (v) => Mul(v, 0.2),
          (v) => Add(v, 1)
        )}
      />
    </composable.MeshStandardMaterial>
  )
}

const BlobDepthMaterial = () => {
  const time = Time()

  return (
    <composable.MeshDepthMaterial depthPacking={RGBADepthPacking}>
      <modules.Translate offset={vec3(1, 0, 0)} space="local" />
      <modules.Scale
        scale={pipe(
          float(InstanceID),
          (v) => Add(time, v),
          (v) => Sin(v),
          (v) => Mul(v, 0.2),
          (v) => Add(v, 1)
        )}
      />
    </composable.MeshDepthMaterial>
  )
}

const SharedBlobMaterial = sharedResource(BlobMaterial)
const SharedBlobDepthMaterial = sharedResource(BlobDepthMaterial)
