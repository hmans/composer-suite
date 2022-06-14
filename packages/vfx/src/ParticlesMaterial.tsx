import { useFrame } from "@react-three/fiber"
import React, { forwardRef, useCallback, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { AddEquation, CustomBlending } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { compileShader, float, makeShaderModule } from "../../shadermaker"

/* Attributes */
const attributes = /*glsl*/ `
attribute vec3 velocity;
attribute vec3 acceleration;
`

const makeTime = () =>
  makeShaderModule({
    uniforms: {
      u_time: { type: "float", value: 0 }
    },

    frameCallback: (material, dt) => {
      material.uniforms.u_time.value += dt
    }
  })

const makeBillboard = () =>
  makeShaderModule({
    vertexHeader: `
    vec3 billboard(vec2 v, mat4 view){
      vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
      vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
      vec3 p = right * v.x + up * v.y;
      return p;
    }
  `,

    vertexMain: /*glsl*/ `
    csm_Position = billboard(csm_Position.xy, viewMatrix);
  `
  })

const makeLifetime = () =>
  makeShaderModule({
    vertexHeader: `
      attribute vec2 time;

      varying float v_timeStart;
      varying float v_timeEnd;
      varying float v_progress;
      varying float v_age;
    `,

    vertexMain: `
      v_timeStart = time.x;
      v_timeEnd = time.y;
      v_age = u_time - v_timeStart;
      v_progress = v_age / (v_timeEnd - v_timeStart);
    `,

    fragmentHeader: `
      varying float v_timeStart;
      varying float v_timeEnd;
      varying float v_progress;
      varying float v_age;
    `,

    fragmentMain: `
      /* Lifetime management: discard this instance if it is not in the current time range */
      if (u_time < v_timeStart || u_time > v_timeEnd) {
        discard;
      }
    `
  })

const makeColor = () =>
  makeShaderModule({
    vertexHeader: `
      attribute vec4 colorStart;
      attribute vec4 colorEnd;

      varying vec4 v_colorStart;
      varying vec4 v_colorEnd;
    `,

    vertexMain: `
      v_colorStart = colorStart;
      v_colorEnd = colorEnd;
    `,

    fragmentHeader: `
      varying vec4 v_colorStart;
      varying vec4 v_colorEnd;
    `,

    fragmentMain: `
      /* Get diffuse color */
      vec4 diffuse4 = vec4(diffuse, 1.0);

      /* Apply the diffuse color */
      csm_DiffuseColor = mix(diffuse4 * v_colorStart, diffuse4 * v_colorEnd, v_progress);

      /* Mix in the texture */
      #ifdef USE_MAP
        csm_DiffuseColor *= texture2D(map, vUv);
      #endif
    `
  })

const animateScale = () =>
  makeShaderModule({
    vertexHeader: `
      attribute vec3 scaleStart;
      attribute vec3 scaleEnd;
    `,

    vertexMain: `
      csm_Position *= mix(scaleStart, scaleEnd, v_progress);
    `
  })

const makeLegacyShader = () =>
  makeShaderModule({
    vertexHeader: `
    ${attributes}
  `,

    vertexMain: `
    /* Apply velocity and acceleration */
    offset += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration);

    /* Apply the instance matrix. */
    offset *= mat3(instanceMatrix);

    /* Apply the offset */
    csm_Position += offset;
  `
  })

type ParticlesMaterialProps = Omit<iCSMProps, "ref"> & {
  billboard?: boolean
}

export const ParticlesMaterial = forwardRef<
  CustomShaderMaterialImpl,
  ParticlesMaterialProps
>(({ billboard = false, ...props }, ref) => {
  const material = useRef<CustomShaderMaterialImpl>(null!)

  const { callback, ...shader } = compileShader(
    makeTime(),
    makeLifetime(),
    animateScale(),
    billboard && makeBillboard(),
    makeColor(),
    makeLegacyShader()
  )

  useFrame((state, dt) => {
    callback(material.current, dt)
  })

  return (
    <CustomShaderMaterial
      ref={mergeRefs([ref, material])}
      blending={CustomBlending}
      blendEquation={AddEquation}
      depthTest={true}
      depthWrite={false}
      {...shader}
      {...props}
    />
  )
})
