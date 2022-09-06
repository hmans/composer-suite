import { FlatStage } from "r3f-stage"

export default function Example() {
  return (
    <FlatStage>
      <Player />
    </FlatStage>
  )
}

const Player = () => {
  return (
    <mesh>
      <dodecahedronGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
