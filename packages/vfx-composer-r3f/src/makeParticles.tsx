import React, { createRef } from "react"
import {
  InstancedParticles,
  InstancedParticlesProps
} from "./InstancedParticles"
import { InstancedParticles as InstancedParticlesImpl } from "vfx-composer"
import { Emitter, EmitterProps } from "./Emitter"

export const makeParticles = () => {
  const particles = createRef<InstancedParticlesImpl>()

  return {
    Root: (props: InstancedParticlesProps) => (
      <InstancedParticles {...props} ref={particles} />
    ),

    Emitter: (props: Omit<EmitterProps, "particles">) => (
      <Emitter {...props} particles={particles} />
    )
  }
}
