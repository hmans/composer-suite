import { Application, FlatStage } from "r3f-stage"
import "r3f-stage/styles.css"
import examples from "./examples"

export default () => (
  <Application examples={examples}>
    <FlatStage />
  </Application>
)
