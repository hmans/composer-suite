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
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3
} from "three"
import { getValue, ValueFactory } from "./ValueFactory"

const tmpVector3 = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3()
const tmpMatrix4 = new Matrix4()

export type MeshParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export type SpawnOptions = {
  position?: ValueFactory<Vector3>
  velocity?: ValueFactory<Vector3>
  acceleration?: ValueFactory<Vector3>
}

export type ParticlesAPI = {
  spawnParticle: (count: number, options: SpawnOptions) => void
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
      (count: number, options: SpawnOptions = {}) => {
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
          /* Set Instance Matrix */
          options.position
            ? tmpVector3.copy(getValue(options.position))
            : tmpVector3.set(0, 0, 0)

          imesh.current.setMatrixAt(
            playhead.current,
            tmpMatrix4.compose(
              tmpVector3,
              tmpRotation.random(),
              tmpScale.setScalar(0.5 + Math.random() * 1)
            )
          )

          /* Set times */
          attributes.time.setXY(
            playhead.current,
            clock.elapsedTime + Math.random() * 0.1,
            clock.elapsedTime + 1 + Math.random() * 0.1
          )

          /* Set velocity */
          options.velocity
            ? tmpVector3.copy(getValue(options.velocity))
            : tmpVector3.set(0, 0, 0)

          attributes.velocity.setXYZ(playhead.current, ...tmpVector3.toArray())

          /* Set acceleration */
          options.acceleration
            ? tmpVector3.copy(getValue(options.acceleration))
            : tmpVector3.set(0, 0, 0)

          attributes.acceleration.setXYZ(
            playhead.current,
            ...tmpVector3.toArray()
          )

          /* Set color */
          attributes.colorStart.setXYZW(playhead.current, 1, 1, 1, 1)
          attributes.colorEnd.setXYZW(playhead.current, 1, 1, 1, 0)

          /* Set scale */
          attributes.scaleStart.setXYZ(playhead.current, 1, 1, 1)
          attributes.scaleEnd.setXYZ(playhead.current, 0, 0, 0)

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
