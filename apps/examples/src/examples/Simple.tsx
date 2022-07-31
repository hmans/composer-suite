import { extend, Node } from "@react-three/fiber"
import { Particles } from "vfx-composer"

extend({ Particles })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      particles: Node<Particles, typeof Particles>
    }
  }
}

export const Simple = () => {
  return <group></group>
}
