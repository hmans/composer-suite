import { useFrame } from "@react-three/fiber"
import { createContext, useContext, useMemo } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"

const ModularShaderMaterialContext = createContext<any>(null!)

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

function useUniform<T>(value: T) {
  return useMemo(() => ({ value }), [])
}

function ModularShaderMaterial({
  children,
  ...props
}: ModularShaderMaterialProps) {
  const u_time = useUniform(0)

  const shaderProps = useMemo(() => {
    const vertexShader = `
      uniform float u_time;

      void main() {
        csm_Position.x += sin(u_time) * 3.0;
      }
    `
    const fragmentShader = ""

    return { vertexShader, fragmentShader, uniforms: { u_time } }
  }, [u_time])

  useFrame((_, dt) => {
    u_time.value += dt
  })

  return (
    <CustomShaderMaterial {...props} {...shaderProps}>
      <ModularShaderMaterialContext.Provider value={123}>
        {children}
      </ModularShaderMaterialContext.Provider>
    </CustomShaderMaterial>
  )
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[7]} />

        <ModularShaderMaterial
          baseMaterial={MeshStandardMaterial}
        ></ModularShaderMaterial>
      </mesh>
    </group>
  )
}
