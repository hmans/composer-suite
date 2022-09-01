import { Animate, useConst } from "@hmans/things"
import { CameraShake, Float, useTexture } from "@react-three/drei"
import { GroupProps, MeshProps } from "@react-three/fiber"
import { composable, modules } from "material-composer-r3f"
import { between, plusMinus, upTo } from "randomish"
import {
  Add,
  Div,
  float,
  GLSLType,
  GradientStops,
  Input,
  InstanceID,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Rotation3DZ,
  Saturate,
  Smoothstep,
  Sub,
  Texture2D,
  TilingUV,
  Time,
  type,
  Unit,
  UV,
  vec2,
  vec3
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise2D } from "shader-composer-toybox"
import { Color, DoubleSide, RepeatWrapping, Vector3 } from "three"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles
} from "vfx-composer-r3f"
import streamTextureUrl from "./textures/stream.png"

const Inverted = <T extends GLSLType>(v: Input<T>) =>
  Unit(type(v), Mul(v, -1), { name: "Inverted Value" })

export default function CometExample() {
  return (
    <group>
      {/* <group position-y={1.5}>
        <TestAura />
      </group> */}
      <CameraShake />
      <Comet scale={0.5} />
    </group>
  )
}

const NoiseMask = (
  threshold: Input<"float"> = 0.5,
  fringe: Input<"float"> = 0.5
) => {
  const noise = NormalizePlusMinusOne(
    PSRDNoise2D(TilingUV(UV, vec2(8, 8), vec2(0, Inverted(Time()))))
  )

  return pipe(
    Smoothstep(
      Sub(threshold, Div(fringe, 2)),
      Add(threshold, Div(fringe, 2)),
      OneMinus(UV.y)
    ),
    (v) => Sub(v, Mul(noise, threshold)),
    Saturate
  )
}

const TestAura = () => {
  return (
    <mesh>
      <planeGeometry />
      <composable.meshBasicMaterial transparent>
        <modules.Color color="white" />
        <modules.Alpha alpha={NoiseMask()} />
      </composable.meshBasicMaterial>
    </mesh>
  )
}

const Aura = ({
  gradient,
  tiling = vec2(3, 1),
  offset = vec2(0, 0),
  fullness = 0.5,
  ...props
}: {
  gradient: GradientStops<"vec3">
  tiling?: Input<"vec2">
  offset?: Input<"vec2">
  fullness?: Input<"float">
} & MeshProps) => {
  /* Load texture */
  const streamTexture = useTexture(streamTextureUrl)
  streamTexture.wrapS = streamTexture.wrapT = RepeatWrapping

  /* Create sampler2D uniform */
  const streamSampler = useUniformUnit("sampler2D", streamTexture)

  /* Sample texture */
  const heat = Texture2D(streamSampler, TilingUV(UV, tiling, offset))

  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 32, 16]} />

      <composable.meshBasicMaterial
        transparent
        side={DoubleSide}
        depthWrite={false}
      >
        <modules.Gradient
          stops={gradient}
          start={0}
          stop={1}
          position={heat.alpha}
        />
        <modules.Alpha alpha={Mul(heat.alpha, NoiseMask(fullness))} />
      </composable.meshBasicMaterial>
    </mesh>
  )
}

const Comet = (props: GroupProps) => (
  <group {...props}>
    <group
      rotation-z={-Math.PI / 3}
      rotation-y={Math.PI / 3}
      position={[-2, -1, 0]}
    >
      <Float speed={14}>
        <Rock />

        <Aura
          scale={[1.5, 2.5, 1.5]}
          position-y={1.2}
          gradient={[
            [new Color("#d62828").multiplyScalar(1.5), 0],
            [new Color("#fb8b24").multiplyScalar(2), 0.5],
            [new Color("#fb8b24").multiplyScalar(2), 0.9],
            [new Color("#f8f9fa").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Inverted(Add(Time(), UV.x)))}
        />

        <Aura
          scale={[1.5, 2, 1.5]}
          position-y={0.8}
          fullness={0.7}
          gradient={[
            [new Color("#d62828").multiplyScalar(1.5), 0],
            [new Color("#fb8b24").multiplyScalar(2), 0.5],
            [new Color("#fb8b24").multiplyScalar(2), 0.9],
            [new Color("#f8f9fa").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Inverted(Add(Time(), UV.x)))}
        />

        <Aura
          scale={[1.8, 1.8, 1.8]}
          position-y={0.4}
          fullness={0.6}
          gradient={[
            [new Color("#9e0059").multiplyScalar(1.5), 0],
            [new Color("#ff0054").multiplyScalar(2), 0.5],
            [new Color("#ff0054").multiplyScalar(2), 0.9],
            [new Color("#ffbd00").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Inverted(Add(Time(), UV.x)))}
        />
      </Float>

      <Debris />

      <SmokeTrail />
    </group>
  </group>
)

const Rock = () => (
  <Animate fun={(g, dt) => (g.rotation.x = g.rotation.y += 2 * dt)}>
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <composable.meshStandardMaterial color="#222" />
    </mesh>
  </Animate>
)

const Debris = () => {
  const particles = useParticles()

  const id = float(InstanceID, { varying: true })

  const getNoise = (offset: Input<"float">) => PSRDNoise2D(vec2(offset, id))

  return (
    <Particles>
      <planeGeometry args={[0.2, 0.2]} />
      <composable.meshBasicMaterial side={DoubleSide} transparent>
        <modules.Alpha alpha={Sub(1, particles.progress)} />

        <modules.Color
          color={pipe(
            id,
            (v) => getNoise(20),
            (v) => NormalizePlusMinusOne(v),
            (v) => Mul(v, 10),
            (v) => Mul(new Color("#fb8b24"), v)
          )}
        />

        <modules.Lifetime {...particles} />

        <modules.Scale scale={Add(2, getNoise(123))} />

        <modules.Translate
          offset={vec3(Mul(getNoise(99), 5), getNoise(67), getNoise(567))}
        />
        <modules.Billboard />

        <modules.Acceleration
          force={Add(
            vec3(0, 10, 0),
            vec3(getNoise(0), getNoise(10), getNoise(80))
          )}
          space="local"
          time={particles.age}
        />

        <modules.Scale scale={particles.age} />
      </composable.meshBasicMaterial>

      <Emitter
        rate={80}
        setup={({ position }) => {
          const theta = plusMinus(Math.PI)
          position.set(Math.cos(theta) * 1.5, 0, Math.sin(theta) * 1.5)
          particles.setLifetime(between(1, 2))
        }}
      />
    </Particles>
  )
}

import { Layers, useRenderPipeline } from "r3f-stage"
import { smokeUrl } from "./textures"

const SmokeTrail = () => {
  const texture = useTexture(smokeUrl)

  const time = useConst(() => Time())
  const particles = useParticles()
  const color = useParticleAttribute(() => new Color())
  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />
        <composable.meshStandardMaterial
          map={texture}
          opacity={0.5}
          transparent
          depthWrite={false}
          color="#123"
        >
          <modules.Color color={color} />
          <modules.Billboard />
          <modules.Scale scale={Add(Mul(particles.progress, 3), 0.5)} />
          <modules.Scale scale={Smoothstep(-0.5, 0.1, particles.progress)} />
          <modules.Scale scale={Smoothstep(1, 0.5, particles.progress)} />

          <modules.Velocity
            velocity={vec3(0, 10, 0)}
            time={particles.age}
            space="local"
          />
          <modules.Softness softness={5} depthTexture={depth} />
          <modules.Lifetime {...particles} />
        </composable.meshStandardMaterial>

        <Emitter
          rate={100}
          setup={({ position, scale }) => {
            particles.setLifetime(between(1, 2))
            position.set(plusMinus(1), 3 + plusMinus(1), plusMinus(1))
            scale.setScalar(between(1, 3))
            color.value.set("#666").multiplyScalar(Math.random())
          }}
        />
      </Particles>
    </group>
  )
}
