import { Module, module } from "./modules"
import { easings } from "./modules/easings"

const compile = (headers: string, main: string) => `
  ${headers}
  void main() {
    ${main}
  }
`

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

  /* Easing functions */
  addModule(easings)

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

  /* Billboarding */
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

  /* Scale animation */
  addModule(
    module({
      vertexHeader: `
      attribute vec3 scaleStart;
      attribute vec3 scaleEnd;
    `,
      vertexMain: `
      csm_Position *= mix(scaleStart, scaleEnd, ${scaleFunction});
    `
    })
  )

  /* Velocity and acceleration */
  addModule(
    module({
      vertexHeader: `
        attribute vec3 velocity;
        attribute vec3 acceleration;
      `,
      vertexMain: `
        csm_Position += vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration) * mat3(instanceMatrix);
      `
    })
  )

  /* Color animation */
  addModule(
    module({
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
      csm_DiffuseColor = mix(diffuse4 * v_colorStart, diffuse4 * v_colorEnd, ${colorFunction});

      /* Mix in the texture */
      #ifdef USE_MAP
        csm_DiffuseColor *= texture2D(map, vUv);
      #endif
    `
    })
  )

  return {
    vertexShader: compile(state.vertexHeaders, state.vertexMain),
    fragmentShader: compile(state.fragmentHeaders, state.fragmentMain),
    uniforms: {
      u_time: {
        value: 0
      }
    }
  }
}
