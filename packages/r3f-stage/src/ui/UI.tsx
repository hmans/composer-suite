import React from "react"
import tunnel from "../lib/tunnel-rat"

export const descriptionTunnel = tunnel()
export const navigationTunnel = tunnel()

export const UI = () => {
  return (
    <>
      <div className="panel" style={{ top: 0, left: 0 }}>
        <navigationTunnel.Out />
      </div>

      <div className="panel description" style={{ bottom: 0, left: 0 }}>
        <descriptionTunnel.Out />
      </div>
    </>
  )
}
