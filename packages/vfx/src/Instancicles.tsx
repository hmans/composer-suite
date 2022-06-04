import { InstancedMeshProps, useFrame, useThree } from "@react-three/fiber"
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from "react"
import {
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3
} from "three"

const tmpPosition = new Vector3()
const tmpRotation = new Quaternion()
const tmpScale = new Vector3()
const tmpMatrix4 = new Matrix4()

type InstanciclesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export type InstanciclesRef = {
  mesh: InstancedMesh
  spawnParticle: (count: number) => void
}

export const Instancicles = forwardRef<InstanciclesRef, InstanciclesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, material, ...props },
    ref
  ) => {
    /* The safetySize allows us to emit a batch of particles that would iotherwise
    exceed the maximum instance count (which would make WebGL crash.) This way, we don't
    have to upload the entirety of all buffers every time the playhead wraps back to 0. */
    const maxInstanceCount = maxParticles + safetySize

    const imesh = useRef<InstancedMesh>(null!)
    const playhead = useRef(0)
    const { clock } = useThree()

    /* Helper method to create new instanced buffer attributes */
    const createAttribute = (itemSize: number) =>
      new InstancedBufferAttribute(
        new Float32Array(maxInstanceCount * itemSize),
        itemSize
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
    useEffect(() => {
      for (const key in attributes) {
        imesh.current.geometry.setAttribute(
          key,
          attributes[key as keyof typeof attributes]
        )
      }

      imesh.current.count = 0
    }, [attributes])

    const spawnParticle = useCallback(
      (count: number) => {
        const { instanceMatrix } = imesh.current

        ;[instanceMatrix, ...Object.values(attributes)].forEach((attribute) => {
          attribute.needsUpdate = true
          attribute.updateRange.offset = playhead.current * attribute.itemSize
          attribute.updateRange.count = count * attribute.itemSize
        })

        for (let i = 0; i < count; i++) {
          /* Set Instance Matrix */
          imesh.current.setMatrixAt(
            playhead.current,
            tmpMatrix4.compose(
              tmpPosition.random().multiplyScalar(3),
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
          attributes.velocity.setXYZ(
            playhead.current,
            ...new Vector3()
              .randomDirection()
              .multiplyScalar(Math.random() * 5)
              .toArray()
          )

          /* Set acceleration */
          attributes.acceleration.setXYZ(playhead.current, 0, 0, 0)

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
        if (playhead.current > imesh.current.count)
          imesh.current.count = playhead.current

        /* If we've gone past the number of max particles, reset the playhead. */
        if (playhead.current > maxParticles) playhead.current = 0
      },
      [attributes]
    )

    useFrame(() => {
      ;(imesh.current.material as any).uniforms.u_time.value = clock.elapsedTime
    })

    useImperativeHandle(ref, () => ({ mesh: imesh.current, spawnParticle }), [])

    return (
      <instancedMesh
        ref={imesh}
        args={[undefined, material, maxInstanceCount]}
        {...props}
      >
        {children}
        {/* <ParticlesMaterial color={color} ref={material} /> */}
      </instancedMesh>
    )
  }
)
