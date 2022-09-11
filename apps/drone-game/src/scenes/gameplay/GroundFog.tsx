import { useTexture } from "@react-three/drei"
import { pipe } from "fp-ts/function"
import { composable, modules } from "material-composer-r3f"
import { Layers, useRenderPipeline } from "render-composer"
import {
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
import { PSRDNoise2D } from "shader-composer-toybox"
import { Emitter, Particles } from "vfx-composer-r3f"
import smokeUrl from "../../assets/smoke.png"

export const GroundFog = () => {
  const texture = useTexture(smokeUrl)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  const InstanceRandom = (offset: Input<"float">) =>
    PSRDNoise2D(Vec2([InstanceID, offset]))

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />
        <composable.meshStandardMaterial
          map={texture}
          opacity={0.1}
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
                NormalizePlusMinusOne(InstanceRandom(2)),
                InstanceRandom(3)
              ]),
              (v) => ScaleAndOffset(v, Vec3([30, 1, 30]))
            )}
          />

          <modules.Softness softness={5} depthTexture={depth} />
        </composable.meshStandardMaterial>

        <Emitter limit={150} rate={Infinity} />
      </Particles>
    </group>
  )
}
