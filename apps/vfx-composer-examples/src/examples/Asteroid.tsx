import { Animate } from "@hmans/things"
import { CameraShake, Float, useTexture } from "@react-three/drei"
import { GroupProps, useThree } from "@react-three/fiber"
import { composable, modules } from "material-composer-r3f"
import { between, plusMinus } from "randomish"
import {
  Abs,
  Add,
  float,
  GlobalTime,
  Input,
  InstanceID,
  Mul,
  Negate,
  NormalizePlusMinusOne,
  pipe,
  Smoothstep,
  Sub,
  UV,
  vec2,
  vec3
} from "shader-composer"
import { PSRDNoise2D } from "shader-composer-toybox"
import { Color, DoubleSide } from "three"
import {
  Emitter,
  Particles,
  useParticleAttribute,
  useParticles
} from "vfx-composer-r3f"
import { SphericalAura } from "./effects/Aura"
import { Lava } from "./modules/Lava"
import { smokeUrl } from "./textures"

export const time = GlobalTime

export default function AsteroidExample() {
  return (
    <group>
      <CameraShake intensity={1.5} />
      <Asteroid scale={0.5} />
    </group>
  )
}

const Asteroid = (props: GroupProps) => (
  <group {...props}>
    <group
      rotation-z={-Math.PI / 3}
      rotation-y={Math.PI / 3}
      position={[-2, -1, 0]}
    >
      <Float speed={340} rotationIntensity={0} floatIntensity={0.3}>
        <Rock />

        {/* Inner Aura */}
        <SphericalAura
          scale={[1.5, 3, 1.5]}
          position-y={1.8}
          gradient={[
            [new Color("#d62828").multiplyScalar(1.5), 0],
            [new Color("#fb8b24").multiplyScalar(2), 0.5],
            [new Color("#fb8b24").multiplyScalar(2), 0.9],
            [new Color("#f8f9fa").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Negate(Add(time, UV.x)))}
          wobble={0.04}
        />

        {/* Middle Aura */}
        <SphericalAura
          scale={[1.6, 2, 1.6]}
          position-y={0.8}
          fullness={0.7}
          gradient={[
            [new Color("#d62828").multiplyScalar(1.5), 0],
            [new Color("#fb8b24").multiplyScalar(2), 0.5],
            [new Color("#fb8b24").multiplyScalar(2), 0.9],
            [new Color("#f8f9fa").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Negate(Add(time, UV.x)))}
          wobble={0.04}
        />

        {/* Outer Aura */}
        <SphericalAura
          scale={[1.8, 1.5, 1.8]}
          position-y={0.4}
          fullness={0.6}
          gradient={[
            [new Color("#3a86ff").multiplyScalar(1.5), 0],
            [new Color("#8338ec").multiplyScalar(2), 0.5],
            [new Color("#8338ec").multiplyScalar(2), 0.9],
            [new Color("#ff006e").multiplyScalar(10), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Negate(Add(time, UV.x)))}
          wobble={0.02}
        />
      </Float>

      <Sparks />
      <RockSplitters />
      <SmokeTrail />
      <Clouds />
      <WindLines />
    </group>
  </group>
)

const Rock = () => (
  <Animate fun={(g, dt) => (g.rotation.x = g.rotation.y += 0.4 * dt)}>
    <mesh>
      <icosahedronGeometry args={[1, 3]} />

      <composable.meshStandardMaterial>
        <modules.SurfaceWobble offset={Mul(time, 0.4)} amplitude={0.1} />

        <Lava
          offset={Mul(vec3(0.4, 0.8, 0.5), time)}
          scale={0.3}
          octaves={5}
          power={1}
        />
      </composable.meshStandardMaterial>
    </mesh>
  </Animate>
)

const Sparks = () => {
  const particles = useParticles()
  const id = float(InstanceID, { varying: true })
  const getNoise = (offset: Input<"float">) => PSRDNoise2D(vec2(offset, id))
  const clock = useThree((s) => s.clock)

  return (
    <Particles capacity={200}>
      <planeGeometry args={[0.2, 0.2]} />
      <composable.meshBasicMaterial side={DoubleSide}>
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

        <modules.SurfaceWobble offset={vec3(time, id, 0)} amplitude={0.5} />

        <modules.Translate
          offset={vec3(Mul(getNoise(99), 5), getNoise(67), getNoise(567))}
        />

        <modules.Velocity
          velocity={vec3(
            Mul(getNoise(87843), 2),
            Mul(Add(Abs(getNoise(123)), 1.3), 20),
            Mul(getNoise(278499), 2)
          )}
          space="local"
          time={particles.age}
        />

        <modules.Scale scale={particles.age} />
      </composable.meshBasicMaterial>

      <Emitter
        rate={() => 50 + Math.sin(clock.elapsedTime * 2) * 30}
        setup={({ position }) => {
          particles.setLifetime(4)
          const theta = plusMinus(Math.PI)
          position.set(Math.cos(theta) * 1.5, 0, Math.sin(theta) * 1.5)
        }}
      />
    </Particles>
  )
}

const RockSplitters = () => {
  const particles = useParticles()
  const id = float(InstanceID, { varying: true })
  const getNoise = (offset: Input<"float">) => PSRDNoise2D(vec2(offset, id))

  return (
    <Particles capacity={100} safetyCapacity={10}>
      <icosahedronGeometry />

      <composable.meshStandardMaterial color="#222">
        <modules.Lifetime {...particles} />

        <modules.Translate
          offset={vec3(Mul(getNoise(99), 5), getNoise(67), getNoise(567))}
        />

        <modules.Velocity
          velocity={vec3(
            Mul(getNoise(87843), 2),
            Mul(Add(Abs(getNoise(123)), 1.3), 40),
            Mul(getNoise(278499), 2)
          )}
          space="local"
          time={particles.age}
        />

        <modules.Acceleration
          force={vec3(0, -60, 0)}
          space="world"
          time={particles.age}
        />

        <modules.Scale scale={Add(2, getNoise(123))} />
      </composable.meshStandardMaterial>

      <Emitter
        rate={10}
        setup={({ position, scale }) => {
          particles.setLifetime(10)
          position.setScalar(plusMinus(0.5))
          scale.setScalar(between(0.1, 0.2))
        }}
      />
    </Particles>
  )
}

const SmokeTrail = () => {
  const texture = useTexture(smokeUrl)

  const particles = useParticles()
  const color = useParticleAttribute(() => new Color())

  return (
    <group>
      <Particles capacity={150} safetyCapacity={10}>
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
          <modules.Alpha
            alpha={(alpha) =>
              Mul(alpha, Smoothstep(1, 0.8, particles.progress))
            }
          />

          <modules.Velocity
            velocity={vec3(0, 10, 0)}
            time={particles.age}
            space="local"
          />
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

const Clouds = () => {
  const texture = useTexture(smokeUrl)

  const particles = useParticles()

  return (
    <group>
      <Particles capacity={100} safetyCapacity={10}>
        <planeGeometry />
        <composable.meshStandardMaterial
          map={texture}
          opacity={0.02}
          transparent
          depthWrite={false}
        >
          <modules.Lifetime {...particles} />

          <modules.Billboard />

          <modules.Velocity
            velocity={vec3(0, 10, 0)}
            time={particles.age}
            space="local"
          />
        </composable.meshStandardMaterial>

        <Emitter
          rate={10}
          setup={({ position, scale }) => {
            particles.setLifetime(10)
            position.set(plusMinus(20), -40 + plusMinus(1), plusMinus(4))
            scale.setScalar(between(5, 20))
          }}
        />
      </Particles>
    </group>
  )
}

const WindLines = () => {
  const particles = useParticles()

  return (
    <group>
      <Particles>
        <planeGeometry args={[0.1, 3.2]} />

        <composable.meshStandardMaterial color="#555" side={DoubleSide}>
          <modules.Velocity
            velocity={vec3(0, 100, 0)}
            time={particles.age}
            space="local"
          />
          <modules.Lifetime {...particles} />
        </composable.meshStandardMaterial>

        <Emitter
          rate={30}
          setup={({ position, scale }) => {
            particles.setLifetime(10)
            position.set(plusMinus(20), -40 + plusMinus(1), plusMinus(4))
            scale.setScalar(between(1, 2))
          }}
        />
      </Particles>
    </group>
  )
}
