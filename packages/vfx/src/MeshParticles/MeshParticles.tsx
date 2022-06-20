import { InstancedMeshProps, useThree } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import mergeRefs from "react-merge-refs"
import {
  Color,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Object3D,
  Quaternion,
  ShaderMaterial,
  Vector3
} from "three"
import {
  createAttributes,
  prepareInstancedMesh,
  registerAttributes
} from "../util/attributes"

const tmpScale = new Vector3()
const tmpMatrix4 = new Matrix4()

const components = {
  position: new Vector3(),
  quaternion: new Quaternion(),
  velocity: new Vector3(),
  acceleration: new Vector3(),
  delay: 0,
  lifetime: 1,
  scale: [new Vector3(), new Vector3()],
  color: [new Color(), new Color()],
  alpha: [1, 0]
}

export type MeshParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export type SpawnOptions = typeof components

export type SpawnSetup = (options: SpawnOptions, index: number) => void

export type ParticlesAPI = {
  spawnParticle: (count: number, setup?: SpawnSetup, origin?: Object3D) => void
}

const ParticlesContext = createContext<ParticlesAPI>(null!)

export const useParticles = () => useContext(ParticlesContext)

export const MeshParticles = forwardRef<InstancedMesh, MeshParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    const imesh = useRef<InstancedMesh>(null!)

    /* The safetySize allows us to emit a batch of particles that would otherwise
    exceed the maximum instance count (which would make WebGL crash.) This way, we don't
    have to upload the entirety of all buffers every time the playhead wraps back to 0. */
    const maxInstanceCount = maxParticles + safetySize

    /* The playhead acts as a cursor through our various buffer attributes. It automatically
    advances every time a new particle is spawned. */
    const playhead = useRef(0)

    /* Let's define a number of attributes. */
    const attributes = useMemo(() => {
      return createAttributes(maxInstanceCount, InstancedBufferAttribute)
    }, [maxInstanceCount])

    /* Register the instance attributes with the imesh. */
    useLayoutEffect(() => {
      prepareInstancedMesh(imesh.current, attributes)
    }, [attributes])

    const spawnParticle = useCallback(
      (count: number, setup?: SpawnSetup, origin?: Object3D) => {
        const { instanceMatrix } = imesh.current

        /* Configure the attributes to upload only the updated parts to the GPU. */
        /* TODO: allow the user to call spawnParticles multiple times within the same frame */
        const allAttributes = [instanceMatrix, ...Object.values(attributes)]
        allAttributes.forEach((attribute) => {
          attribute.needsUpdate = true
          attribute.updateRange.offset = playhead.current * attribute.itemSize
          attribute.updateRange.count = count * attribute.itemSize
        })

        /* For every spawned particle, write some data into the attribute buffers. */
        for (let i = 0; i < count; i++) {
          /* Reset components */
          components.position.set(0, 0, 0)
          components.quaternion.set(0, 0, 0, 1)
          components.velocity.set(0, 0, 0)
          components.acceleration.set(0, 0, 0)
          components.scale[0].set(1, 1, 1)
          components.scale[1].set(1, 1, 1)
          components.delay = 0
          components.lifetime = 1
          components.color[0].setRGB(1, 1, 1)
          components.color[1].setRGB(1, 1, 1)
          components.alpha = [1, 0]

          /* TODO: Apply origin */
          // if (origin) {
          //   origin.getWorldPosition(components.position)
          //   origin.getWorldQuaternion(components.quaternion)
          //   origin.getWorldScale(components.scale[0])
          //   origin.getWorldScale(components.scale[1])
          // }

          /* Run setup */
          setup?.(components, i)

          imesh.current.setMatrixAt(
            playhead.current,
            tmpMatrix4.compose(
              components.position,
              components.quaternion,
              tmpScale.setScalar(1)
            )
          )

          /* Set times */
          const currentTime = (imesh.current.material as ShaderMaterial)
            .uniforms.u_time.value
          attributes.time.setXY(
            playhead.current,
            currentTime + components.delay,
            currentTime + components.lifetime
          )

          /* Set velocity */
          attributes.velocity.setXYZ(
            playhead.current,
            ...components.velocity.toArray()
          )

          /* Set acceleration */
          attributes.acceleration.setXYZ(
            playhead.current,
            ...components.acceleration.toArray()
          )

          /* Set color */
          attributes.color0.setXYZW(
            playhead.current,
            components.color[0].r,
            components.color[0].g,
            components.color[0].b,
            components.alpha[0]
          )
          attributes.color1.setXYZW(
            playhead.current,
            components.color[1].r,
            components.color[1].g,
            components.color[1].b,
            components.alpha[1]
          )

          /* Set scale */
          attributes.scale0.setXYZ(
            playhead.current,
            ...components.scale[0].toArray()
          )
          attributes.scale1.setXYZ(
            playhead.current,
            ...components.scale[1].toArray()
          )

          /* Advance playhead */
          playhead.current++
        }

        /* Increase count of imesh to match playhead */
        if (playhead.current > imesh.current.count) {
          imesh.current.count = playhead.current
        }

        /* If we've gone past the number of max particles, reset the playhead. */
        if (playhead.current > maxParticles) {
          playhead.current = 0
        }
      },
      [attributes]
    )

    return (
      <instancedMesh
        ref={mergeRefs([imesh, ref])}
        args={[geometry, undefined, maxInstanceCount]}
        {...props}
      >
        <ParticlesContext.Provider value={{ spawnParticle }}>
          {children}
        </ParticlesContext.Provider>
      </instancedMesh>
    )
  }
)
