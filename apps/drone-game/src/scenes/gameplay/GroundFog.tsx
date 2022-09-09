import { useConst } from "@hmans/things"
import { useTexture } from "@react-three/drei"
import { composable, modules } from "material-composer-r3f"
import { between, plusMinus } from "randomish"
import { Layers, useRenderPipeline } from "render-composer"
import { Mul, Rotation3DZ, Time } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { Emitter, Particles, useParticleAttribute } from "vfx-composer-r3f"
import smokeUrl from "../../assets/smoke.png"

export const GroundFog = () => {
  const texture = useTexture(smokeUrl)

  const scale = useParticleAttribute(() => 1 as number)
  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

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
          <modules.Scale scale={scale} />
          <modules.Billboard />
          <modules.Softness softness={5} depthTexture={depth} />
        </composable.meshStandardMaterial>

        <Emitter
          limit={150}
          rate={Infinity}
          setup={({ position }) => {
            position.set(plusMinus(30), between(-2, 4), plusMinus(30))
            scale.value = between(8, 10)
          }}
        />
      </Particles>
    </group>
  )
}
