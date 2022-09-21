import { useTexture } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { pipe } from "fp-ts/function"
import { composable, modules } from "material-composer-r3f"
import { bitmask, Layers, useRenderPipeline } from "render-composer"
import {
  Add,
  Float,
  GlobalTime,
  Input,
  InstanceID,
  Mul,
  Rotation3DZ,
  ScaleAndOffset,
  Sub,
  Vec3
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { Random } from "shader-composer-toybox"
import { Color } from "three"
import { Emitter, Particles } from "vfx-composer-r3f"

export type NebulaProps = {
  dimensions?: Input<"vec3">
  amount?: number
  rotationSpeed?: Input<"float">
  minSize?: Input<"float">
  maxSize?: Input<"float">
  opacity?: Input<"float">
  color?: Input<"vec3">
} & GroupProps

export const Nebula = ({
  amount = 25,
  dimensions = Vec3([10, 10, 10]),
  rotationSpeed = 0.03,
  minSize = 2,
  maxSize = 8,
  opacity = 0.5,
  color = new Color("#ccc"),
  ...props
}: NebulaProps) => {
  const texture = useTexture("/textures/smoke.png")

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  const InstanceRandom = (offset: Input<"float">) =>
    Random(Add(Mul(Float(InstanceID), 1.23), offset))

  return (
    <group {...props}>
      <Particles layers-mask={bitmask(Layers.TransparentFX)} capacity={amount}>
        <planeGeometry />
        <composable.meshStandardMaterial
          map={texture}
          transparent
          depthWrite={false}
          color="#ccc"
        >
          {/* Apply a random rotation */}
          <modules.Rotate
            rotation={Rotation3DZ(Mul(InstanceRandom(9999), Math.PI))}
          />

          {/* Rotate over time */}
          <modules.Rotate
            rotation={pipe(
              InstanceRandom(-87),
              (v) => ScaleAndOffset(v, 2, -1),
              (v) => Mul(v, rotationSpeed),
              (v) => Mul(v, GlobalTime),
              Rotation3DZ
            )}
          />

          <modules.Billboard />

          <modules.Scale
            scale={ScaleAndOffset(
              InstanceRandom(123),
              Sub(maxSize, minSize),
              minSize
            )}
          />

          <modules.Translate
            offset={pipe(
              Vec3([InstanceRandom(1), InstanceRandom(2), InstanceRandom(3)]),
              (v) => Sub(v, Vec3([0.5, 0.5, 0.5])),
              (v) => Mul(v, dimensions)
            )}
            space="local"
          />

          <modules.Color color={(c) => Mul(c, color)} />
          <modules.Alpha alpha={(a) => Mul(a, opacity)} />

          <modules.Softness softness={5} depthTexture={depth} />
        </composable.meshStandardMaterial>

        <Emitter limit={amount} rate={Infinity} />
      </Particles>
    </group>
  )
}
