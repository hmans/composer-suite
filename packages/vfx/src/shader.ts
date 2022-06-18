/* Varyings */
const varyingsChunk = /*glsl*/ `
    varying vec4 v_colorStart;
    varying vec4 v_colorEnd;
  `

/* Attributes */
const attributesChunk = /*glsl*/ `
    attribute vec3 velocity;
    attribute vec3 acceleration;
    attribute vec4 colorStart;
    attribute vec4 colorEnd;
    attribute vec3 scaleStart;
    attribute vec3 scaleEnd;
  `

type Module = {
  vertexHeader: string
  vertexMain: string
  fragmentHeader: string
  fragmentMain: string
}

const module = (input: Partial<Module>): Module => ({
  vertexHeader: "",
  vertexMain: "",
  fragmentHeader: "",
  fragmentMain: "",
  ...input
})

export const createShader = ({
  billboard = false,
  scaleFunction = "v_progress",
  colorFunction = "v_progress"
} = {}) => {
  const state = {
    vertexHeaders: "",
    vertexMain: "",
    fragmentHeaders: "",
    fragmentMain: ""
  }

  const addModule = (module: Module) => {
    state.vertexHeaders += module.vertexHeader
    state.vertexMain += module.vertexMain
    state.fragmentHeaders += module.fragmentHeader
    state.fragmentMain += module.fragmentMain
  }

  /* Effect Time */
  addModule(
    module({
      vertexHeader: `uniform float u_time;`,
      fragmentHeader: `uniform float u_time;`
    })
  )

  /* Particle lifetime */
  addModule(
    module({
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
  )

  if (billboard) {
    addModule(
      module({
        vertexHeader: `
        /* Billboard helper */
        vec3 billboard(vec2 v, mat4 view){
          vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
          vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
          vec3 p = right * v.x + up * v.y;
          return p;
        }
      `,
        vertexMain: `
        csm_Position = billboard(csm_Position.xy, viewMatrix);
      `
      })
    )
  }

  /* Legacy */
  addModule(
    module({
      vertexHeader: `
      ${varyingsChunk}
      ${attributesChunk}
      `,
      vertexMain: `
      v_colorStart = colorStart;
      v_colorEnd = colorEnd;

      /* Start with an origin offset */
      vec3 offset = vec3(0.0, 0.0, 0.0);

      /* Apply velocity and acceleration */
      offset += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration);

      /* Apply scale */
      csm_Position *= mix(scaleStart, scaleEnd, ${scaleFunction});

      /* Apply the instance matrix. */
      offset *= mat3(instanceMatrix);

      /* Apply the offset */
      csm_Position += offset;
    `,
      fragmentHeader: `
      ${varyingsChunk}
    `,
      fragmentMain: `

      /* Get diffuse color */
      vec4 diffuse4 = vec4(diffuse, 1.0);

      /* Apply the diffuse color */
      csm_DiffuseColor = mix(diffuse4 * v_colorStart, diffuse4 * v_colorEnd, ${colorFunction});

      /* Mix in the texture */
      #ifdef USE_MAP
        csm_DiffuseColor *= texture2D(map, vUv);
      #endif
    `
    })
  )

  /* Vertex Shader */
  const vertexShader = /* glsl */ `
    ${state.vertexHeaders}

    void main() {
      ${state.vertexMain}
    }
  `

  /* Fragment Shader */
  const fragmentShader = /* glsl */ `
    ${state.fragmentHeaders}

    void main() {
      ${state.fragmentMain}
    }
  `

  const uniforms = {
    u_time: {
      value: 0
    }
  }

  return { vertexShader, fragmentShader, uniforms }
}
