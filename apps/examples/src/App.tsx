import {
  Application,
  Description,
  Example,
  FlatStage,
  Heading
} from "r3f-stage"
import "r3f-stage/styles.css"
import FireballExample from "./examples/Fireball"
import { FireflyExample } from "./examples/FireflyExample"
import { Fog } from "./examples/Fog"
import PlasmaBallExample from "./examples/PlasmaBall"
import Playground from "./examples/Playground"
import { Simple } from "./examples/Simple"
import { SoftParticlesExample } from "./examples/SoftParticlesExample"
import { Stress } from "./examples/Stress"
import { Vanilla } from "./examples/Vanilla"

export default () => (
  <Application>
    <FlatStage>
      <Heading>Particle Effects</Heading>

      <Example path="particles/simple" title="Simple" makeDefault>
        <Simple />

        <Description>The Hello World of VFX Composer particles!</Description>
      </Example>

      <Example path="particles/stress" title="Stress Test">
        <Stress />

        <Description>
          Just a cute little particle effect that emits 100,000 new particles
          per second.
        </Description>
      </Example>

      <Example path="particles/firefly" title="Firefly">
        <FireflyExample />
      </Example>

      <Example path="particles/vanilla" title="Vanilla Three.js">
        <Vanilla />

        <Description>
          An example for how to use VFX Composer with vanilla Three.js. This
          example creates two particle effects that re-use the same VFX
          material, but have different geometries and emitting behaviors.
        </Description>
      </Example>

      <Example path="soft-particles" title="Soft Particles">
        <SoftParticlesExample />
      </Example>

      <Example path="fog" title="Fog">
        <Fog />

        <Description>
          Particle-based fog. Particles use billboarded plane geometries with a
          smoke texture and some very low alpha. They also use softness in order
          to nicely blend into the scene's geometry.
        </Description>
      </Example>

      <Heading>Effects</Heading>

      <Example path="fireball" title="Fireball">
        <FireballExample />

        <Description>
          An animated fireball! This example uses a normal mesh together with
          VFXMaterial.
        </Description>
      </Example>

      <Example path="plasmaball" title="Plasma Ball">
        <PlasmaBallExample />
      </Example>

      <Heading>Experiments</Heading>
      <Example path="playground" title="Playground">
        <Playground />
      </Example>
    </FlatStage>
  </Application>
)
