import { composable, modules } from "material-composer-r3f"
import { between, insideSphere } from "randomish"
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
import { Vector3 } from "three"
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

      <Blobs position={[1, 0, 0]} />
      {/* <Blobs position={[-1, 3, -10]} rotation-z={Math.PI} scale={4} /> */}
      {/* <Blobs position={[0, 2, -40]} scale={10} /> */}
    </group>
  )
}

const Blobs = (props: ParticlesProps) => (
  <Particles maxParticles={1_000} castShadow receiveShadow {...props}>
    <sphereGeometry args={[0.08, 16, 16]} />
    <SharedBlobMaterial.Use />
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

const BlobMaterial = () => (
  <composable.MeshStandardMaterial
    color="#e63946"
    metalness={0.5}
    roughness={0.6}
    autoShadow
  >
    <modules.Translate offset={vec3(1, 0, 0)} space="local" />
    <modules.Scale
      scale={pipe(
        float(InstanceID),
        (v) => Add(Time(), v),
        (v) => Sin(v),
        (v) => Mul(v, 0.2),
        (v) => Add(v, 1)
      )}
    />
  </composable.MeshStandardMaterial>
)

const SharedBlobMaterial = sharedResource(BlobMaterial)
