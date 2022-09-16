import * as PP from "postprocessing"
import { forwardRef, useContext, useImperativeHandle, useMemo } from "react"
import { EffectComposerContext } from "../EffectComposer"

export type LambdaPassProps = {
  fun: Function
}

export const LambdaPass = forwardRef<PP.LambdaPass, LambdaPassProps>(
  ({ fun }, ref) => {
    const pass = useMemo(() => new PP.LambdaPass(fun), [])
    useContext(EffectComposerContext).useItem(pass)
    useImperativeHandle(ref, () => pass)
    return null
  }
)
