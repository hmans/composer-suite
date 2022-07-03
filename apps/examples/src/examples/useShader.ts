import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { compileShader, IShaderNode } from "shadenfreude"

export function useShader(ctor: () => IShaderNode, deps?: any[]) {
  const [shader, update] = useMemo(() => compileShader(ctor()), deps)
  useFrame((_, dt) => update(dt))
  return shader
}
