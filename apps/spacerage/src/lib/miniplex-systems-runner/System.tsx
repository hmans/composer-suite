import { useFrame } from "@react-three/fiber"
import { Bucket, World } from "miniplex"
import { createReactAPI } from "miniplex/react"
import { useLayoutEffect, useRef } from "react"

type SystemsEntity = {
  name: string
  timings: {
    values: Float32Array
    cursor: number
    average: number
  }
}

const systems = new World<SystemsEntity>()
export const SystemsECS = createReactAPI(systems)

export type SystemProps<E> = {
  name?: string
  fun: (dt: number) => void
  world: World<E>
  archetype?: Bucket<E>
  updatePriority?: number
  samples?: 16 | 32 | 64 | 128 | 256 | 512
}

export const System = ({
  name = "Anonymous",
  fun,
  updatePriority,
  samples = 128
}: SystemProps<any>) => {
  const system = useRef<SystemsEntity>(null!)

  useLayoutEffect(() => {
    const entity = systems.add({
      name,
      timings: {
        values: new Float32Array(samples),
        average: 0,
        cursor: 0
      }
    })

    system.current = entity

    return () => {
      systems.remove(entity)
    }
  }, [])

  useFrame((_, dt) => {
    if (name) {
      performance.mark(`${name} start`)
    }

    fun(dt)

    if (name) {
      performance.mark(`${name} end`)
      const results = performance.measure(name, `${name} start`, `${name} end`)

      /* Capture timing */
      const { timings } = system.current
      timings.values[timings.cursor] = results.duration
      timings.cursor = (timings.cursor + 1) % samples
      // timings.cursor = timings.cursor & (samples - 1)

      /* Calculate average */
      let sum = 0
      for (let i = 0; i < timings.values.length; i++) {
        sum += timings.values[i]
      }
      timings.average = sum / timings.values.length
    }
  }, updatePriority)

  return null
}
