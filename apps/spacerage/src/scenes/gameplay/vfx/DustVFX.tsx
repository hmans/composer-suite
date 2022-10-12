import { flow, pipe } from "fp-ts/lib/function"
import { Composable, Modules } from "material-composer-r3f"
import { GlobalTime, Mul, ScaleAndOffset, Sin, Vec3 } from "shader-composer"
import { Emitter, InstancedParticles } from "vfx-composer-r3f"
import { InstanceRNG } from "../../../lib/InstanceRNG"
import { useAsset } from "../assets"

export const DustVFX = ({ capacity = 10000 }) => {
  const rng = InstanceRNG()

  return (
    <InstancedParticles capacity={capacity}>
      <planeGeometry args={[0.1, 0.1]} />

      <Composable.MeshStandardMaterial
        map={useAsset.textures.particle()}
        transparent
      >
        <Modules.Billboard />

        {/* Base position */}
        <Modules.Translate
          offset={pipe(
            Vec3([rng(1), rng(0.2), rng(-0.5)]),
            (v) => ScaleAndOffset(v, 2, -1),
            (v) => ScaleAndOffset(v, Vec3([500, 500, 10]))
          )}
        />

        {/* Animated offset */}
        <Modules.Translate
          offset={pipe(
            Vec3([rng(0.5), rng(2), rng(0.2)]),
            (v) => ScaleAndOffset(v, 2, -1),
            (v) => ScaleAndOffset(v, Mul(Sin(Mul(GlobalTime, 0.07 / 100)), 100))
          )}
        />
        <Modules.Translate
          offset={pipe(
            Vec3([rng(5), rng(-2), rng(3)]),
            (v) => ScaleAndOffset(v, 2, -1),
            (v) => ScaleAndOffset(v, Mul(Sin(Mul(GlobalTime, 0.13 / 100)), 100))
          )}
        />

        {/* Color */}
        <Modules.Color color={flow((v) => Mul(v, rng(9)))} />
      </Composable.MeshStandardMaterial>

      <Emitter rate={Infinity} limit={capacity} />
    </InstancedParticles>
  )
}
