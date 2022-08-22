import { ModuleFactory } from "material-composer"
import { Billboard as BillboardUnit } from "shader-composer-toybox"

export const Billboard: ModuleFactory = () => (state) => ({
  ...state,
  position: BillboardUnit(state.position)
})
