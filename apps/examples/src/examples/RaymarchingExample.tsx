import { useRef } from "react"
import {
  Factory,
  float,
  ResolutionNode,
  ShaderMaterialMasterNode,
  TimeNode,
  uniqueGlobalIdentifier,
  UVNode,
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
  const fresnel = uniqueGlobalIdentifier()
  const smin = uniqueGlobalIdentifier()

  return {
    name: "Raymarching Example",

    inputs: {
      uv: vec2(UVNode()),
      time: float(TimeNode()),
      resolution: vec2(ResolutionNode()),
      viewDirection: vec3(ViewDirectionNode())
    },

    outputs: {
      value: vec3(),
      alpha: float()
    },

    fragment: {
      header: /*glsl*/ `
        float ${smin}(in float a, in float b, float k)
        {
            float h = max(k - abs(a-b), 0.0);
            return min(a, b) - h*h/(k * 4.0);
        }

        float ${sphere}(in vec3 ray, in vec3 pos, in float radius)
        {
          return length(ray - pos) - radius;
        }

        float ${map}(in vec3 ray) {
          float sphere1 = ${sphere}(ray, vec3(
            0.0,
            sin(u_time * 1.3) * 0.5,
            cos(u_time * 1.2)),
            0.5);

            float sphere2 = ${sphere}(ray, vec3(
              sin(u_time * 1.7) * 0.5,
              0.0,
              sin(u_time * 1.9)),
              0.5);

          return ${smin}(sphere1, sphere2, 0.3);
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

        float ${fresnel}(in vec3 normal, in vec3 viewDirection)
        {
          float factor = 1.0;
          float bias = 0.0;
          float intensity = 0.5;
          float power = 2.0;

          float f_a = (factor + dot(viewDirection, normal));
          float f_fresnel = bias + intensity * pow(abs(f_a), power);
          f_fresnel = clamp(f_fresnel, 0.0, 1.0);
          return f_fresnel;
        }

    `,

      body: /*glsl*/ `
        vec2 screenPos = (2.0 * inputs.uv - vec2(1.0)) / 1.0;
        vec3 viewPos = vec3(0.0, 0.0, 10.0);
        vec3 viewDir = normalize(vec3(screenPos, -3.5));

        // Do the raymarch
        float t = ${castRay}(viewPos, viewDir);

        // Assemble color
        vec3 color;
        float alpha = 0.0;

        if (t > 0.0) {
          alpha = 1.0;

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

          // fresnel
          color += vec3(0.4) * ${fresnel}(normal, viewDir);
        }

        outputs.value = color;
        outputs.alpha = alpha;
      `
    }
  }
})

export default function RaymarchingExample() {
  const shaderProps = useShader(() => {
    const raymarcher = RaymarchingNode()

    return ShaderMaterialMasterNode({
      color: raymarcher.outputs.value,
      alpha: raymarcher.outputs.alpha
    })
  })

  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <planeGeometry args={[40, 40]} />
        <shaderMaterial
          ref={material}
          {...shaderProps}
          side={DoubleSide}
          transparent
        />
      </mesh>
    </group>
  )
}
