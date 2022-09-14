import React, { FC, Fragment, ReactNode, useState } from "react"
import { Delay } from "./Delay"

type RepeatProps = { children: ReactNode; times?: number; seconds?: number }

const Wrap = ({ children }: { children: ReactNode }) => <>{children}</>

export const Repeat: FC<RepeatProps> = ({
  children,
  times = Infinity,
  seconds = 1
}) => {
  const [iteration, setIteration] = useState(1)

  return (
    <Fragment>
      {iteration < times && (
        <Delay
          key={`delay-${iteration}`}
          seconds={seconds}
          onComplete={() => {
            setIteration((i) => i + 1)
          }}
        />
      )}

      {/* To my surprise, React.Fragment with a key did not work here. */}
      <Wrap key={iteration}>{children}</Wrap>
    </Fragment>
  )
}
