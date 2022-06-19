import React, { FC, Fragment, ReactNode, useState } from "react"
import { Delay } from "./Delay"

type RepeatProps = { children: ReactNode; times?: number; interval?: number }

export const Repeat: FC<RepeatProps> = ({
  children,
  times = Infinity,
  interval = 1
}) => {
  const [iteration, setIteration] = useState(1)

  return (
    <Fragment key={iteration}>
      {iteration < times && (
        <Delay
          seconds={interval}
          onComplete={() => setIteration(iteration + 1)}
        />
      )}
      {children}
    </Fragment>
  )
}
