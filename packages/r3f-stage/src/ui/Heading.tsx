import React, { ReactNode } from "react"
import { navigationTunnel } from "./UI"

export type HeadingProps = {
  children: ReactNode
}

export const Heading = ({ children }: HeadingProps) => (
  <navigationTunnel.In>
    <h1>{children}</h1>
  </navigationTunnel.In>
)
