import React from "react"
import { descriptionTunnel } from "./UI"

export type DescriptionProps = { children: React.ReactNode }

export const Description = ({ children }: DescriptionProps) => {
  return <descriptionTunnel.In>{children}</descriptionTunnel.In>
}
