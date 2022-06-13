import { forwardRef, ReactNode } from "react"
import { CSMBaseMaterial, iCSMParams } from "three-custom-shader-material/types"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../vanilla/ParticlesMaterial"

export type ParticlesMaterialProps = iCSMParams & {
  baseMaterial?: CSMBaseMaterial
  children?: ReactNode
}

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticlesMaterialProps
>(({ children, baseMaterial, ...props }, ref) => {
  return <particlesMaterial args={[{ baseMaterial }]} {...props} ref={ref} />
})
