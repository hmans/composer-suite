import { useState } from "react"
import { Fragment } from "react"
import { ReactNode } from "react"
import { FC } from "react"
import { Delay } from "./Delay"

type RepeatProps = { children: ReactNode; times?: number; delay?: number }

export const Repeat: FC<RepeatProps> = ({ children, times = 1, delay = 1 }) => {
  const [iteration, setIteration] = useState(1)

  return (
    <Fragment key={iteration}>
      {iteration < times && (
        <Delay seconds={delay} onComplete={() => setIteration(iteration + 1)} />
      )}
      {children}
    </Fragment>
  )
}
