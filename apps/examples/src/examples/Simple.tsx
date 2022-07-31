import { extend, Node, useFrame } from "@react-three/fiber"
import { upTo } from "randomish"
import { useRef } from "react"
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
  const particles = useRef<Particles>(null!)

  useFrame(() => {
    particles.current.spawn(1, (p) => {
      p.randomDirection().multiplyScalar(upTo(10))
    })
  })

  return (
    <group>
      <particles args={[undefined, undefined, 10000]} ref={particles}>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </particles>
    </group>
  )
}
