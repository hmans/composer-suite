import { useFrame } from "@react-three/fiber"
import { Archetype, IEntity, World } from "miniplex"
import { createECS } from "miniplex-react"
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
export const SystemsECS = createECS(systems)

export type SystemProps<E extends IEntity> = {
  name?: string
  fun: (dt: number) => void
  world: World<E>
  archetype?: Archetype<E>
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
    const entity = systems.createEntity({
      name,
      timings: {
        values: new Float32Array(samples),
        average: 0,
        cursor: 0
      }
    })

    system.current = entity

    return () => {
      systems.destroyEntity(entity)
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
