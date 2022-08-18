import { Application, Description, Example, FlatStage } from "r3f-stage"
import "r3f-stage/styles.css"
import { Simple } from "./examples/Simple"
import { Vanilla } from "./examples/Vanilla"

export default () => (
  <Application>
    <FlatStage>
      <Example path="simple" title="Hello World" makeDefault>
        <Simple />

        <Description>The Hello World of VFX Composer!</Description>
      </Example>

      <Example path="vanilla" title="Vanilla Three.js">
        <Vanilla />

        <Description>
          An example for how to use VFX Composer with vanilla Three.js. This
          example creates two particle effects that re-use the same VFX
          material, but have different geometries and emitting behaviors.
        </Description>
      </Example>
    </FlatStage>
  </Application>
)
