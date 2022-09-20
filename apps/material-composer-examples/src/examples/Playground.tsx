import { useConst } from "@hmans/use-const"
import { useInstanceHandle } from "@react-three/fiber"
import { Color, composable } from "material-composer-r3f"
import { useLayoutEffect, useRef, useState } from "react"

export default function Playground() {
  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <composable.meshStandardMaterial>
          <Color color="yellow" />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
