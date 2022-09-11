import { useTexture } from "@react-three/drei"
import { pipe } from "fp-ts/function"
import { composable, modules } from "material-composer-r3f"
import { Layers, useRenderPipeline } from "render-composer"
import {
  Add,
  Div,
  Float,
  GlobalTime,
  Input,
  InstanceID,
  Mul,
  NormalizePlusMinusOne,
  Rotation3DZ,
  ScaleAndOffset,
  Sub,
  Vec2,
  Vec3
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise2D, Random } from "shader-composer-toybox"
import { Emitter, Particles } from "vfx-composer-r3f"
import smokeUrl from "../../assets/smoke.png"

export const GroundFog = () => (
  <Fog dimensions={Vec3([30, 30, 30])} amount={150} />
)

export type FogProps = {
  dimensions?: Input<"vec3">
  amount?: number
}

export const Fog = ({
  amount = 25,
  dimensions = Vec3([10, 10, 10])
}: FogProps) => {
  const texture = useTexture(smokeUrl)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  const InstanceRandom = (offset: Input<"float">) =>
    Random(Add(Mul(Float(InstanceID), 100), offset))

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX} capacity={amount}>
        <planeGeometry />
        <composable.meshStandardMaterial
          map={texture}
          opacity={0.05}
          transparent
          depthWrite={false}
        >
          <modules.Rotate
            rotation={Rotation3DZ(Mul(InstanceRandom(9999), Math.PI))}
          />

          <modules.Rotate
            rotation={pipe(
              GlobalTime,
              (v) => Mul(v, InstanceRandom(-87)),
              (v) => Mul(v, 0.05),
              Rotation3DZ
            )}
          />

          <modules.Billboard />

          <modules.Scale
            scale={pipe(InstanceRandom(123), NormalizePlusMinusOne, (v) =>
              ScaleAndOffset(v, 10, 5)
            )}
          />

          <modules.Translate
            offset={pipe(
              Vec3([
                InstanceRandom(0.1),
                InstanceRandom(0.2),
                InstanceRandom(0.3)
              ]),
              (v) => Sub(v, Vec3([0.5, 0.5, 0.5])),
              (v) => Mul(v, dimensions)
            )}
            space="local"
          />

          <modules.Softness softness={5} depthTexture={depth} />
        </composable.meshStandardMaterial>

        <Emitter limit={amount} rate={Infinity} />
      </Particles>
    </group>
  )
}
