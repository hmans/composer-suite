import React, { createRef } from "react"
import { Particles, ParticlesProps } from "./Particles"
import { Particles as ParticlesImpl } from "../Particles"
import { Emitter, EmitterProps } from "./Emitter"

export const makeParticles = () => {
  const particles = createRef<ParticlesImpl>()

  return {
    Root: (props: ParticlesProps) => <Particles {...props} ref={particles} />,

    Emitter: (props: Omit<EmitterProps, "particles">) => (
      <Emitter {...props} particles={particles} />
    )
  }
}
