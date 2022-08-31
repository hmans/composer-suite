import React, { FC } from "react"
import { ThreeApplication, ThreeApplicationProps } from "./ThreeApplication"
import { UI } from "./ui/UI"

export type ApplicationProps = {} & ThreeApplicationProps

export const Application: FC<ApplicationProps> = ({ ...props }) => {
  return (
    <>
      <UI />
      <ThreeApplication {...props} />
    </>
  )
}
