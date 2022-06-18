import { InstancedMeshProps, useFrame, useThree } from "@react-three/fiber"
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
  Quaternion,
  Vector3
} from "three"

const tmpScale = new Vector3()
const tmpMatrix4 = new Matrix4()

const components = {
  position: new Vector3(),
  quaternion: new Quaternion(),
  velocity: new Vector3(),
  acceleration: new Vector3(),
  delay: 0,
  lifetime: 1,
  scale0: new Vector3(),
  scale1: new Vector3(),
  color0: new Color(),
  color1: new Color(),
  alphaStart: 1,
  alphaEnd: 0
}

export type MeshParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export type SpawnOptions = typeof components

export type SpawnSetup = (options: SpawnOptions) => void

export type ParticlesAPI = {
  spawnParticle: (count: number, setup?: SpawnSetup) => void
}

const ParticlesContext = createContext<ParticlesAPI>(null!)

export const useParticles = () => useContext(ParticlesContext)

export const MeshParticles = forwardRef<InstancedMesh, MeshParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    /* The safetySize allows us to emit a batch of particles that would otherwise
    exceed the maximum instance count (which would make WebGL crash.) This way, we don't
    have to upload the entirety of all buffers every time the playhead wraps back to 0. */
    const maxInstanceCount = maxParticles + safetySize

    const imesh = useRef<InstancedMesh>(null!)
    const playhead = useRef(0)
    const { clock } = useThree()

    /* Helper method to create new instanced buffer attributes */
    const createAttribute = useCallback(
      (itemSize: number) =>
        new InstancedBufferAttribute(
          new Float32Array(maxInstanceCount * itemSize),
          itemSize
        ),
      [maxInstanceCount]
    )

    /* Let's define a number of attributes. */
    const attributes = useMemo(
      () => ({
        time: createAttribute(2),
        velocity: createAttribute(3),
        acceleration: createAttribute(3),
        color0: createAttribute(4),
        color1: createAttribute(4),
        scale0: createAttribute(3),
        scale1: createAttribute(3)
      }),
      [maxInstanceCount]
    )

    /* Register the instance attributes with the imesh. */
    useLayoutEffect(() => {
      for (const key in attributes) {
        imesh.current.geometry.setAttribute(
          key,
          attributes[key as keyof typeof attributes]
        )
      }

      imesh.current.count = 0
    }, [attributes])

    const spawnParticle = useCallback(
      (count: number, setup?: SpawnSetup) => {
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
          components.scale0.set(1, 1, 1)
          components.scale1.set(1, 1, 1)
          components.delay = 0
          components.lifetime = 1
          components.color0.setRGB(1, 1, 1)
          components.color1.setRGB(1, 1, 1)
          components.alphaStart = 1
          components.alphaEnd = 0

          /* Run setup */
          setup?.(components)

          imesh.current.setMatrixAt(
            playhead.current,
            tmpMatrix4.compose(
              components.position,
              components.quaternion,
              tmpScale.setScalar(1)
            )
          )

          /* Set times */
          attributes.time.setXY(
            playhead.current,
            clock.elapsedTime + components.delay,
            clock.elapsedTime + components.lifetime
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
            components.color0.r,
            components.color0.g,
            components.color0.b,
            components.alphaStart
          )
          attributes.color1.setXYZW(
            playhead.current,
            components.color1.r,
            components.color1.g,
            components.color1.b,
            components.alphaEnd
          )

          /* Set scale */
          attributes.scale0.setXYZ(
            playhead.current,
            ...components.scale0.toArray()
          )
          attributes.scale1.setXYZ(
            playhead.current,
            ...components.scale1.toArray()
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

    /* Every frame, advance the time uniform */
    useFrame(() => {
      ;(imesh.current.material as any).uniforms.u_time.value = clock.elapsedTime
    })

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
