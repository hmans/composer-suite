import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { compileShader, Node } from "shadenfreude"

export const useShader = (ctor: () => Node, deps?: any) => {
  const [shader, update] = useMemo(() => compileShader(ctor()), deps)
  useFrame((_, dt) => update(dt))
  return shader
}
