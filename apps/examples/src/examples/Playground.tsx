import { InstancedMeshProps } from "@react-three/fiber"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { InstancedMesh } from "three"
import { Particles } from "vfx-composer"

export default function Playground() {
  return (
    <Particles>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </Particles>
  )
}
