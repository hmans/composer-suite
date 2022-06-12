import { Node } from "@react-three/fiber"
import { forwardRef } from "react"
import { CSMBaseMaterial } from "three-custom-shader-material/types"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../vanilla/ParticlesMaterial"

export type ParticlesMaterialProps = Node<
  ParticlesMaterialImpl,
  typeof ParticlesMaterialImpl
> & { baseMaterial: CSMBaseMaterial }

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticlesMaterialProps
>(({ children, baseMaterial, ...props }, ref) => {
  return <particlesMaterial args={[{ baseMaterial }]} {...props} ref={ref} />
})
