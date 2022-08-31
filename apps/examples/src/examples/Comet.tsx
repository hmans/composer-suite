import { Animate } from "@hmans/things"
import { CameraShake, Float, useTexture } from "@react-three/drei"
import { GroupProps, MeshProps } from "@react-three/fiber"
import { composable, modules } from "material-composer-r3f"
import { between, plusMinus } from "randomish"
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
  Rotation3DY,
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
import { Color, DoubleSide, RepeatWrapping } from "three"
import { Emitter, Particles, useParticles } from "vfx-composer-r3f"
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
      <composable.MeshBasicMaterial transparent>
        <modules.Color color="white" />
        <modules.Alpha alpha={NoiseMask()} />
      </composable.MeshBasicMaterial>
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

      <composable.MeshBasicMaterial
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
      </composable.MeshBasicMaterial>
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
    </group>
  </group>
)

const Rock = () => (
  <Animate fun={(g, dt) => (g.rotation.x = g.rotation.y += 2 * dt)}>
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <composable.MeshStandardMaterial color="#222" />
    </mesh>
  </Animate>
)

const Debris = () => {
  const particles = useParticles()

  const id = float(InstanceID, { varying: true })

  return (
    <Particles>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <composable.MeshBasicMaterial side={DoubleSide} transparent>
        <modules.Alpha alpha={Sub(1, particles.progress)} />
        <modules.Color
          color={Mul(
            new Color("#fb8b24"),
            Mul(NormalizePlusMinusOne(PSRDNoise2D(vec2(-20, id))), 10)
          )}
        />
        <modules.Lifetime {...particles} />

        <modules.Translate
          offset={vec3(
            Mul(PSRDNoise2D(vec2(99, id)), 5),
            PSRDNoise2D(vec2(199, id)),
            PSRDNoise2D(vec2(199, id))
          )}
        />
        <modules.Rotate rotation={Rotation3DY(Mul(particles.age, 4))} />

        <modules.Acceleration
          force={Add(
            vec3(0, 10, 0),
            vec3(
              PSRDNoise2D(vec2(0, id)),
              PSRDNoise2D(vec2(10, id)),
              PSRDNoise2D(vec2(80, id))
            )
          )}
          space="local"
          time={particles.age}
        />

        <modules.Scale scale={particles.age} />
      </composable.MeshBasicMaterial>

      <Emitter
        rate={12}
        setup={({ position }) => {
          const theta = plusMinus(Math.PI)
          position.set(Math.cos(theta), 0, Math.sin(theta))
          particles.setLifetime(between(1, 2))
        }}
      />
    </Particles>
  )
}
