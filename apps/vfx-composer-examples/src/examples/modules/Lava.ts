import { ModuleFactory } from "material-composer"
import { moduleComponent } from "material-composer-r3f"
import { Heat, HeatOptions } from "material-composer/units"
import { Gradient } from "shader-composer-three"
import { Color } from "three"

export type LavaProps = HeatOptions

export const LavaModule: ModuleFactory<LavaProps> = (props) => (state) => ({
  ...state,
  color: Gradient(
    Heat(state.position, props),
    [new Color("#03071E"), 0],
    [new Color("#03071E"), 0.1],
    [new Color("#DC2F02").multiplyScalar(1), 0.5],
    [new Color("#E85D04").multiplyScalar(10), 0.6],
    [new Color("#FFBA08").multiplyScalar(10), 0.65],
    [new Color("white").multiplyScalar(1), 0.99],
    [new Color("white").multiplyScalar(1), 1]
  )
})

export const Lava = moduleComponent(LavaModule)
