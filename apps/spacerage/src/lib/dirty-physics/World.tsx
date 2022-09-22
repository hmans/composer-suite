import { ReactNode } from "react"

export type WorldProps = {
  children?: ReactNode
}

export const World = ({ children }: WorldProps) => {
  return <>{children}</>
}
