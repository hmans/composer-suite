import { FC } from "react"
import { ReactNode } from "react"
import { useDelay } from "./Delay"

type LifetimeProps = {
  children?: ReactNode
  seconds: number
}

export const Lifetime: FC<LifetimeProps> = ({ children, seconds }) => {
  const ready = useDelay(seconds)

  return ready ? null : <>{children}</>
}
