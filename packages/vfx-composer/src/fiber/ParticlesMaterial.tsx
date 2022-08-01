import { useFrame } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react"
import { iCSMProps } from "three-custom-shader-material"
import { ModulePipe } from "../modules"
import {
  ParticlesMaterial as ParticlesMaterialImpl,
  ParticlesMaterialArgs
} from "../ParticlesMaterial"

const Context = createContext<ParticlesMaterialImpl>(null!)

export type ParticlesMaterialProps = iCSMProps & { modules: ModulePipe }

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticlesMaterialProps
>(({ children, ...props }, ref) => {
  const [material, setMaterial] = useState(
    () => new ParticlesMaterialImpl(props as ParticlesMaterialArgs)
  )

  useFrame((_, dt) => {
    material.tick(dt)
  })

  useEffect(() => () => material.dispose(), [material])

  useImperativeHandle(ref, () => material)

  return (
    <primitive object={material} attach="material" {...props}>
      <Context.Provider value={material}>{children}</Context.Provider>
    </primitive>
  )
})
