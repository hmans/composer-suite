import { GroupProps, useLoader } from "@react-three/fiber"
import { composable, modules } from "material-composer-r3f"
import {
  $,
  Add,
  GlobalTime,
  Input,
  InstanceID,
  Mat3,
  Mul,
  Pow,
  Rotation3D,
  Rotation3DY,
  ScaleAndOffset,
  Vec3
} from "shader-composer"
import { Random } from "shader-composer-toybox"
import { DoubleSide, Material, Mesh } from "three"
import { GLTFLoader } from "three-stdlib"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"

export const AsteroidBelt = (props: GroupProps) => (
  <group {...props}>
    <SmallAsteroids amount={100_000} />
    <LargeAsteroids amount={10_000} />
  </group>
)

const SmallAsteroids = ({ amount = 10_000 }: { amount?: number }) => {
  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)
  const setup: InstanceSetupCallback = () => {}

  return (
    <InstancedParticles capacity={amount}>
      <planeGeometry />

      <composable.meshStandardMaterial side={DoubleSide} color="#000">
        <modules.Scale scale={ScaleAndOffset(random(0.1), 0.1, 0.01)} />
        <BeltModules height={12} />
      </composable.meshStandardMaterial>

      {/* Spawn 10.000 of them! */}
      <Emitter limit={amount} rate={Infinity} setup={setup} />
    </InstancedParticles>
  )
}

const LargeAsteroids = ({ amount = 10_000 }: { amount?: number }) => {
  const gltf = useLoader(GLTFLoader, "/models/asteroid03.gltf")
  const mesh = gltf.scene.children[0] as Mesh

  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 7.3`)

  const setup: InstanceSetupCallback = () => {}

  const rotationAxis = ScaleAndOffset(
    Vec3([random(12), random(84), random(1)]),
    2,
    -1
  )

  return (
    <InstancedParticles geometry={mesh.geometry} capacity={amount}>
      <composable.material instance={(mesh.material as Material).clone()}>
        <RotateOverTime
          axis={rotationAxis}
          speed={ScaleAndOffset(random(-5), 2, -1)}
        />
        <modules.Scale scale={ScaleAndOffset(Pow(random(1), 3), 0.3, 0.1)} />

        <BeltModules height={6} />
      </composable.material>

      <Emitter limit={amount} rate={Infinity} setup={setup} />
    </InstancedParticles>
  )
}

const RotateOverTime = ({
  axis = Vec3([0, 0, 1]),
  speed = 1
}: {
  axis: Input<"vec3">
  speed?: Input<"float">
}) => (
  <modules.Rotate rotation={Mat3(Rotation3D(axis, Mul(GlobalTime, speed)))} />
)

type BeltProps = {
  width?: Input<"float">
  height?: Input<"float">
  distance?: Input<"float">
}

const BeltModules = ({ width = 40, distance = 15, height = 5 }: BeltProps) => {
  const random = (offset: Input<"float">) =>
    Random($`${offset} + float(${InstanceID}) * 1.1005`)

  return (
    <>
      {/* Apply a random offset (position) */}
      <modules.Translate
        offset={Vec3([
          Add(Mul(random(0.2), width), distance),
          ScaleAndOffset(random(0.3), height, Mul(height, -0.5)),
          0
        ])}
      />

      {/* Distribute asteroids radially */}
      <modules.Rotate rotation={Rotation3DY(Mul(random(0.4), Math.PI * 2))} />

      {/* Rotate everything over time */}
      <modules.Rotate
        rotation={Rotation3DY(
          Mul(GlobalTime, ScaleAndOffset(Pow(random(0.25), 3), 0.05, 0.01))
        )}
      />
    </>
  )
}
