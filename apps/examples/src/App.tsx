import { Application, Description, Example, FlatStage } from "r3f-stage"
import "r3f-stage/styles.css"
import FireballExample from "./examples/Fireball"
import { Simple } from "./examples/Simple"
import { Vanilla } from "./examples/Vanilla"

export default () => (
  <Application>
    <FlatStage>
      <Example path="particles/simple" title="Simple Particles" makeDefault>
        <Simple />

        <Description>The Hello World of VFX Composer particles!</Description>
      </Example>

      <Example path="particles/vanilla" title="Vanilla Particles">
        <Vanilla />

        <Description>
          An example for how to use VFX Composer with vanilla Three.js. This
          example creates two particle effects that re-use the same VFX
          material, but have different geometries and emitting behaviors.
        </Description>
      </Example>

      <Example path="fireball" title="Fireball">
        <FireballExample />

        <Description>
          An animated fireball! This example uses a normal mesh together with
          VFXMaterial.
        </Description>
      </Example>
    </FlatStage>
  </Application>
)
