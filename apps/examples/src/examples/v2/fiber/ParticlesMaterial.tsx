import { Node } from "@react-three/fiber"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../vanilla/ParticlesMaterial"
import { CSMBaseMaterial } from "three-custom-shader-material/types"
import { forwardRef, useMemo } from "react"

export type ParticlesMaterialProps = Node<
  ParticlesMaterialImpl,
  typeof ParticlesMaterialImpl
> & { baseMaterial: CSMBaseMaterial }

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticlesMaterialProps
>(({ children, baseMaterial, ...props }, ref) => {
  const args = useMemo(() => ({ baseMaterial }), [baseMaterial])

  return <particlesMaterial args={[args]} {...props} ref={ref} />
})
