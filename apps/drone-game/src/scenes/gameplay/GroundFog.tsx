import { useTexture } from "@react-three/drei"
import { pipe } from "fp-ts/function"
import { composable, modules } from "material-composer-r3f"
import { useRenderPipeline } from "render-composer"
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
import { Emitter, Particles } from "vfx-composer-r3f"
import smokeUrl from "../../assets/smoke.png"

export const GroundFog = () => (
  <Fog dimensions={Vec3([30, 30, 30])} amount={150} />
)

export type FogProps = {
  dimensions?: Input<"vec3">
  amount?: number
  rotationSpeed?: Input<"float">
}

/* TODO: extract this Fog component into vfx-composer! */
export const Fog = ({
  amount = 25,
  dimensions = Vec3([10, 10, 10]),
  rotationSpeed = 0.03
}: FogProps) => {
  const texture = useTexture(smokeUrl)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  const InstanceRandom = (offset: Input<"float">) =>
    Random(Add(Mul(Float(InstanceID), 100), offset))

  return (
    <group>
      <Particles capacity={amount}>
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
              InstanceRandom(-87),
              (v) => ScaleAndOffset(v, 2, -1),
              (v) => Mul(v, rotationSpeed),
              (v) => Mul(v, GlobalTime),
              Rotation3DZ
            )}
          />

          <modules.Billboard />

          <modules.Scale scale={ScaleAndOffset(InstanceRandom(123), 10, 2)} />

          <modules.Translate
            offset={pipe(
              Vec3([InstanceRandom(1), InstanceRandom(2), InstanceRandom(3)]),
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
