import React, { FC, ReactNode } from "react"

export const Footer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1,
        bottom: 10,
        left: 10
      }}
    >
      {children}
    </div>
  )
}
