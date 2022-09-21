import { useConst } from "@hmans/use-const"
import { useInstanceHandle } from "@react-three/fiber"
import { composable } from "material-composer-r3f"
import { useLayoutEffect, useRef, useState } from "react"

export default function Playground() {
  const object = useConst(() => ({}))
  const ref = useRef()

  const instance = useInstanceHandle(ref)

  useLayoutEffect(() => {
    console.log(instance.current.parent)
  }, [])

  return (
    <group position-y={1.5}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />

        <composable.meshStandardMaterial>
          <primitive object={object} ref={ref} />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
