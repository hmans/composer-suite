import { Application, Description, Example, Heading } from "r3f-stage"
import "r3f-stage/styles.css"
import BillboardingExample from "./examples/Billboarding"
import DiscoCube from "./examples/DiscoCube"
import DissolveExample from "./examples/Dissolve"
import Fireball from "./examples/Fireball"
import Flag from "./examples/Flag"
import FloatingIslandExample from "./examples/FloatingIsland"
import ForceField from "./examples/ForceField"
import HelloWorld from "./examples/HelloWorld"
import Planet from "./examples/Planet"
import Rotation from "./examples/Rotation"
import StylizedWater from "./examples/StylizedWater"
import Textures from "./examples/Textures"
import WaterExample from "./examples/Water"

function App() {
  return (
    <Application>
      <Heading>The Basics</Heading>

      <Example path="hello-world" title="Hello World" makeDefault>
        <Description>
          A simple example demonstrating <strong>color changes</strong>,{" "}
          <strong>vertex displacement</strong>, and using <strong>uniforms</strong>.
        </Description>

        <HelloWorld />
      </Example>

      <Heading>Techniques</Heading>

      <Example path="billboarding" title="Billboarding">
        <BillboardingExample />
      </Example>

      <Example path="rotation" title="Rotation (Vertex Displacement)">
        <Description>
          Sometimes you'll want to perform rotation within the vertex shader (and not in
          the scene itself.) This example shows you how, including how to fix the normals
          so lighting still works as intended.
        </Description>

        <Rotation />
      </Example>

      <Example path="textures" title="Textures">
        <Textures />
      </Example>

      <Heading>Demos</Heading>

      <Example path="flag" title="Flag">
        <Description>A wavy flag!</Description>
        <Flag />
      </Example>

      <Example path="dissolve" title="Dissolve">
        <Description>The classic Dissolve effect.</Description>
        <DissolveExample />
      </Example>

      <Example path="fireball" title="Fireball">
        <Description>
          <p>
            Holy crap, it's a freakin' <strong>ball of fire</strong>!
          </p>
          <p>
            This example applies two separate PSRD noise functions &ndash; one for the
            wobbly <strong>vertex displacement</strong>, the other for{" "}
            <strong>picking a color from a tiny palette texture</strong> to visualize
            heat/fiery doom.
          </p>
        </Description>

        <Fireball />
      </Example>

      <Example path="forcefield" title="Force Field">
        <Description>A wavy flag!</Description>
        <ForceField />
      </Example>

      <Example path="planet" title="Planet">
        <Planet />
      </Example>

      <Example path="disco-cube" title="Disco Cube">
        <DiscoCube />
      </Example>

      <Example path="floating-island" title="Floating Island">
        <Description>
          This example demonstrates <strong>vertex displacement</strong> and{" "}
          <strong>applying colors based on displaced vertex positions</strong>. It also
          shows you how to customize the mesh's <strong>depth material</strong> (which is
          needed for proper shadows).
        </Description>

        <FloatingIslandExample />
      </Example>

      <Example path="stylized-water" title="Stylized Water">
        <StylizedWater />
      </Example>

      <Example path="raging-sea" title="Raging Sea">
        <WaterExample />
      </Example>
    </Application>
  )
}

export default App
