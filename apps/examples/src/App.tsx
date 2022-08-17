import { Application, Description, Example } from "r3f-stage"
import "r3f-stage/styles.css"
import Simple from "./examples/Simple"
import { Vanilla } from "./examples/Vanilla"

export default () => (
  <Application>
    <Example path="simple" makeDefault>
      <Description>Poop</Description>
    </Example>
  </Application>
)
