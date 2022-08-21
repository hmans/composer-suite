import { ModuleFactory } from "."
import { Billboard as BillboardUnit } from "../units"

export const Billboard: ModuleFactory = () => (state) => ({
  ...state,
  position: BillboardUnit(state.position)
})
