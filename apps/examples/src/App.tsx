import { Application, Example, FlatStage } from "r3f-stage"
import "r3f-stage/styles.css"
import { Simple } from "./examples/Simple"

export default () => (
  <Application>
    <FlatStage>
      <Example path="simple" title="Hello World" makeDefault>
        <Simple />
      </Example>
    </FlatStage>
  </Application>
)
