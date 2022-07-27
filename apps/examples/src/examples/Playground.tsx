import { Particles } from "vfx-composer"

export default function Playground() {
  return (
    <Particles position-y={2}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </Particles>
  )
}
