import { RootState, useFrame } from "@react-three/fiber"
import {
  FC,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react"
import { Group, Object3D } from "three"

export type AnimationFunction = <T extends Object3D>(
  dt: number,
  object: T,
  r3fstate: RootState
) => void

export type AnimateProps = {
  children?: ReactNode
  update?: AnimationFunction
  init?: (object: Group) => void
}

export const Animate = forwardRef<Group, AnimateProps>(
  ({ children, update, init }, ref) => {
    const group = useRef<Group>(null!)

    useLayoutEffect(() => {
      if (!group.current) return
      init?.(group.current)
    }, [])

    useFrame((state, dt) => {
      update?.(dt, group.current!, state)
    })

    useImperativeHandle(ref, () => group.current)

    return <group ref={group}>{children}</group>
  }
)
