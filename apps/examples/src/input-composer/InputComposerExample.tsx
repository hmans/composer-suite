import { FlatStage } from "r3f-stage"
import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"

type Vector = { x: number; y: number }

const resetVector = (v: Vector) => {
  v.x = 0
  v.y = 0

  return v
}

export default function Example() {
  const moveControl = useMemo(() => {
    console.log("This is a good place to put your setup code.")

    const moveVector = { x: 0, y: 0 }

    return () => pipe(moveVector, resetVector)
  }, [])

  useFrame(() => {
    const move = moveControl()
    console.log(move)
  })

  return (
    <FlatStage>
      <Player />
    </FlatStage>
  )
}

const Player = () => {
  return (
    <mesh position-y={0.5} castShadow>
      <capsuleGeometry args={[0.25, 0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
