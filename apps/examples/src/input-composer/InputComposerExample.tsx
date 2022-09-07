import { GroupProps, useFrame } from "@react-three/fiber"
import { pipe } from "fp-ts/lib/function"
import { IVector } from "input-composer"
import { Description, FlatStage } from "r3f-stage"
import { forwardRef, useMemo, useRef } from "react"
import { Group, Vector3 } from "three"

const tmpVec3 = new Vector3()

const useVectorControl = () => {
  const vector: IVector = { x: 0, y: 0 }

  const get = () => pipe(vector)

  return { get }
}

export default function Example({ playerSpeed = 3 }) {
  const player = useRef<Group>(null!)

  const moveControl = useVectorControl()

  useFrame((_, dt) => {
    const move = moveControl.get()
    console.log(move)
    // player.current.position.add(
    //   tmpVec3.set(move.x, 0, -move.y).multiplyScalar(playerSpeed * dt)
    // )
  })

  return (
    <FlatStage>
      <Player ref={player} />
      <Description>
        A playground for prototyping <strong>Input Composer</strong>, the
        successor to <strong>Controlfreak</strong>.
      </Description>
    </FlatStage>
  )
}

const Player = forwardRef<Group, GroupProps>((props, ref) => (
  <group ref={ref} {...props}>
    <mesh position-y={0.5} castShadow>
      <capsuleGeometry args={[0.25, 0.5, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </group>
))
