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
  const calcNormal = uniqueGlobalIdentifier()

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

        vec3 ${calcNormal}(in vec3 pos)
        {
            vec2 e = vec2(0.0001, 0.0);

            return normalize(
                vec3(
                    ${map}(pos + e.xyy) - ${map}(pos-e.xyy),
                    ${map}(pos + e.yxy) - ${map}(pos-e.yxy),
                    ${map}(pos + e.yyx) - ${map}(pos-e.yyx)));
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
          vec3 normal = ${calcNormal}(viewPos + t * viewDir);
          vec3 diffuseColor = vec3(0.8, 0.5, 0.3);

          // ambient light
          color += diffuseColor * 0.16;

          // sun light
          vec3 sunDir = normalize(vec3(1.0, 0.2, 0.5));
          float sunIntensity = max(0.0, dot(normal, sunDir));
          color += diffuseColor * sunIntensity;

          // sky light
          vec3 skyDir = normalize(vec3(0.0, 1.0, 0.0));
          float skyIntensity = max(0.0, dot(normal, skyDir));
          color += vec3(0.8, 0.8, 1.0) * skyIntensity * 0.4;
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
