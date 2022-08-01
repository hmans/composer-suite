import { useFrame } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState
} from "react"
import { iCSMProps } from "three-custom-shader-material"
import { Module, ModulePipe } from "../modules"
import {
  ParticlesMaterial as ParticlesMaterialImpl,
  ParticlesMaterialArgs
} from "../ParticlesMaterial"

const Context = createContext<{
  addModule: (module: Module) => void
  removeModule: (module: Module) => void
}>(null!)

export const useParticlesMaterialContext = () => useContext(Context)

export type ParticlesMaterialProps = iCSMProps

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticlesMaterialProps
>(({ children, ...props }, ref) => {
  const [modules, setModules] = useState<ModulePipe>([])

  const [material, setMaterial] = useState(
    () => new ParticlesMaterialImpl(props as ParticlesMaterialArgs)
  )

  useFrame((_, dt) => {
    material.tick(dt)
  })

  useEffect(() => {
    material.modules = modules
  }, [modules])

  useEffect(() => () => material.dispose(), [material])

  useImperativeHandle(ref, () => material)

  const addModule = useCallback(
    (module: Module) => {
      console.log("adding module", module)
      setModules((modules) => [...modules, module])
    },
    [material]
  )

  const removeModule = useCallback(
    (module: Module) => {
      console.log("removing module", module)
      // setModules((modules) => [...modules, module])
    },
    [material]
  )

  return (
    <primitive object={material} attach="material" {...props}>
      <Context.Provider value={{ addModule, removeModule }}>
        {children}
      </Context.Provider>
    </primitive>
  )
})
