import { Application, Description, Example } from "r3f-stage"
import "r3f-stage/styles.css"
import Simple from "./examples/Simple"
import { Vanilla } from "./examples/Vanilla"

export default () => (
  <Application>
    <Example path="simple" title="Hello World" makeDefault>
      <Description>
        A very simple fountain-like example. Probably the "Hello World" of
        particle systems.
      </Description>

      <Simple />
    </Example>

    <Example path="vanilla" title="Vanilla Three.js">
      <Description>
        You can use VFX Composer with vanilla Three.js! This example shows you
        how.
      </Description>

      <Vanilla />
    </Example>
  </Application>
)
