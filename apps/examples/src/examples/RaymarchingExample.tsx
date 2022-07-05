import { useRef } from "react"
import {
  Factory,
  ResolutionNode,
  ShaderMaterialMasterNode,
  uniqueGlobalIdentifier,
  vec2,
  vec3,
  ViewDirectionNode
} from "shadenfreude"
import { DoubleSide, ShaderMaterial } from "three"
import { useShader } from "./useShader"

const RaymarchingNode = Factory(() => {
  const sphere = uniqueGlobalIdentifier()
  const map = uniqueGlobalIdentifier()
  const castRay = uniqueGlobalIdentifier()

  return {
    name: "Raymarching Example",

    inputs: {
      resolution: vec2(ResolutionNode()),
      viewDirection: vec3(ViewDirectionNode())
    },

    outputs: {
      value: vec3()
    },

    fragment: {
      header: /*glsl*/ `
        float ${sphere}(in vec3 ray, in vec3 pos, in float radius)
        {
          return length(ray - pos) - radius;
        }

        float ${map}(in vec3 ray) {
          float sphere = ${sphere}(ray, vec3(0.0, 0.0, 0.0), 0.5);
          return sphere;
        }

        float ${castRay}(in vec3 rayPos, in vec3 rayDir)
        {
          float t = 0.0;

          for (int i = 0; i < 100; i++)
          {
              vec3 pos = rayPos + t * rayDir;
              float h = ${map}(pos);
              if (h < 0.001) break;
              t += h;
              if (t > 20.0) break;
          }

          if (t > 20.0) t = -1.0;

          return t;
        }

    `,

      body: /*glsl*/ `
        vec2 screenPos = (2.0 * gl_FragCoord.xy - inputs.resolution) / inputs.resolution.y;
        vec3 viewPos = vec3(0.0, 0.0, 10.0);
        vec3 viewDir = normalize(vec3(screenPos, -3.5));

        // Do the raymarch
        float t = ${castRay}(viewPos, viewDir);

        // Assemble color
        vec3 color;

        if (t > 0.0) {
          color += vec3(t, t, t);
        }

        outputs.value = color;
      `
    }
  }
})

export default function RaymarchingExample() {
  const shaderProps = useShader(() => {
    return ShaderMaterialMasterNode({
      color: RaymarchingNode()
    })
  })
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <planeGeometry args={[30, 20]} />
        <shaderMaterial ref={material} {...shaderProps} side={DoubleSide} />
      </mesh>
    </group>
  )
}
