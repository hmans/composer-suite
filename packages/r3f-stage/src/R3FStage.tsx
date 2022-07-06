import React, { FC, ReactNode } from "react"
import { Footer } from "./Footer"
import { R3FCanvas } from "./R3FCanvas"

export const R3FStage: FC<{ children: ReactNode; footer?: ReactNode }> = ({
  children,
  footer
}) => {
  return (
    <>
      {footer && <Footer>{footer}</Footer>}
      <R3FCanvas>{children}</R3FCanvas>
    </>
  )
}
