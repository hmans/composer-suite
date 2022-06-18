export const makeShader = () => {
  /* Uniforms */
  const uniforms = /*glsl*/ `
    uniform float u_time;
    uniform bool u_billboard;
  `

  /* Varyings */
  const varyings = /*glsl*/ `
    varying float v_timeStart;
    varying float v_timeEnd;
    varying float v_progress;
    varying float v_age;
    varying vec4 v_colorStart;
    varying vec4 v_colorEnd;
  `

  /* Attributes */
  const attributes = /*glsl*/ `
    attribute vec2 time;
    attribute vec3 velocity;
    attribute vec3 acceleration;
    attribute vec4 colorStart;
    attribute vec4 colorEnd;
    attribute vec3 scaleStart;
    attribute vec3 scaleEnd;
  `

  /* Vertex Shader */
  const vertexShader = /* glsl */ `
    ${uniforms}
    ${varyings}
    ${attributes}

    /* Billboard helper */
    vec3 billboard(vec2 v, mat4 view){
      vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
      vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
      vec3 p = right * v.x + up * v.y;
      return p;
    }

    /* Set the varyings we want to forward */
    void setVaryings() {
      v_timeStart = time.x;
      v_timeEnd = time.y;
      v_colorStart = colorStart;
      v_colorEnd = colorEnd;
      v_age = u_time - v_timeStart;
      v_progress = v_age / (v_timeEnd - v_timeStart);
    }

    void main() {
      setVaryings();

      /* Apply Billboarding */
      if (u_billboard) {
        csm_Position = billboard(csm_Position.xy, viewMatrix);
      }

      /* Start with an origin offset */
      vec3 offset = vec3(0.0, 0.0, 0.0);

      /* Apply velocity and acceleration */
      offset += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration);

      /* Apply scale */
      csm_Position *= mix(scaleStart, scaleEnd, v_progress);

      /* Apply the instance matrix. */
      offset *= mat3(instanceMatrix);

      /* Apply the offset */
      csm_Position += offset;
    }
  `

  /* Fragment Shader */
  const fragmentShader = /* glsl */ `
    ${uniforms}
    ${varyings}

    void main() {
      /* Lifetime management: discard this instance if it is not in the current time range */
      if (u_time < v_timeStart || u_time > v_timeEnd) {
        discard;
      }

      /* Get diffuse color */
      vec4 diffuse4 = vec4(diffuse, 1.0);

      /* Apply the diffuse color */
      csm_DiffuseColor = mix(diffuse4 * v_colorStart, diffuse4 * v_colorEnd, v_progress);

      /* Mix in the texture */
      #ifdef USE_MAP
        csm_DiffuseColor *= texture2D(map, vUv);
      #endif
    }
  `

  return { vertexShader, fragmentShader }
}
