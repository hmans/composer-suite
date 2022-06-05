import { InstancedMeshProps, useFrame, useThree } from "@react-three/fiber"
import {
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

const tmpRotation = new Quaternion()
const tmpScale = new Vector3()
const tmpMatrix4 = new Matrix4()

const components = {
  position: new Vector3(),
  velocity: new Vector3(),
  acceleration: new Vector3(),
  delay: 0,
  lifetime: 1,
  scaleStart: new Vector3(),
  scaleEnd: new Vector3(),
  colorStart: new Color(),
  colorEnd: new Color(),
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
    { maxParticles = 1_000, safetySize = 100, children, material, ...props },
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
        colorStart: createAttribute(4),
        colorEnd: createAttribute(4),
        scaleStart: createAttribute(3),
        scaleEnd: createAttribute(3)
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
          components.velocity.set(0, 0, 0)
          components.acceleration.set(0, 0, 0)
          components.scaleStart.set(1, 1, 1)
          components.scaleEnd.set(1, 1, 1)
          components.delay = 0
          components.lifetime = 1
          components.colorStart.setRGB(1, 1, 1)
          components.colorEnd.setRGB(1, 1, 1)
          components.alphaStart = 1
          components.alphaEnd = 0

          /* Run setup */
          setup?.(components)

          imesh.current.setMatrixAt(
            playhead.current,
            tmpMatrix4.compose(
              components.position,
              tmpRotation,
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
          attributes.colorStart.setXYZW(
            playhead.current,
            components.colorStart.r,
            components.colorStart.g,
            components.colorStart.b,
            components.alphaStart
          )
          attributes.colorEnd.setXYZW(
            playhead.current,
            components.colorEnd.r,
            components.colorEnd.g,
            components.colorEnd.b,
            components.alphaEnd
          )

          /* Set scale */
          attributes.scaleStart.setXYZ(
            playhead.current,
            ...components.scaleStart.toArray()
          )
          attributes.scaleEnd.setXYZ(
            playhead.current,
            ...components.scaleEnd.toArray()
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
        args={[undefined, material, maxInstanceCount]}
        {...props}
      >
        <ParticlesContext.Provider value={{ spawnParticle }}>
          {children}
        </ParticlesContext.Provider>
      </instancedMesh>
    )
  }
)
