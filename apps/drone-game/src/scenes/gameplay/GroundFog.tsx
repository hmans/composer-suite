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
  Vec2,
  Vec3
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise2D, Random } from "shader-composer-toybox"
import { Emitter, Particles } from "vfx-composer-r3f"
import smokeUrl from "../../assets/smoke.png"

export const GroundFog = () => <Fog dimensions={Vec3([10, 50, 10])} />

export type FogProps = {
  dimensions?: Input<"vec3">
}

export const Fog = ({ dimensions = Vec3([10, 10, 10]) }: FogProps) => {
  const texture = useTexture(smokeUrl)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  const InstanceRandom = (offset: Input<"float">) =>
    Random(Add(Mul(Float(InstanceID), 100), offset))

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
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
                InstanceRandom(1),
                InstanceRandom(50),
                InstanceRandom(0.4)
              ]),
              (v) => Mul(v, dimensions)
            )}
            space="world"
          />

          <modules.Softness softness={5} depthTexture={depth} />
        </composable.meshStandardMaterial>

        <Emitter limit={10} rate={Infinity} />
      </Particles>
    </group>
  )
}
