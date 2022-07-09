import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { compileShader, Variable } from "shadenfreude"

export const useShader = (ctor: () => Variable, deps?: any) => {
  const [shader, update] = useMemo(() => compileShader(ctor()), deps)
  useFrame((_, dt) => update(dt))
  return shader
}
