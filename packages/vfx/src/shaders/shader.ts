import { formatValue, Module, module } from "./modules"
import { easings } from "./modules/easings"

const compile = (headers: string, main: string) => `
  ${headers}
  void main() {
    ${main}
  }
`

export const createShader = ({
  billboard = false,
  softness = 0,
  scaleFunction = "v_progress",
  colorFunction = "v_progress",
  softnessFunction = "clamp(distance / softness, 0.0, 1.0)"
} = {}) => {
  const state = {
    vertexHeaders: "",
    vertexMain: "",
    fragmentHeaders: "",
    fragmentMain: ""
  }

  const addModule = (module: Module) => {
    state.vertexHeaders += module.vertexHeader
    state.vertexMain += `{ ${module.vertexMain} }`
    state.fragmentHeaders += module.fragmentHeader
    state.fragmentMain += `{ ${module.fragmentMain} }`
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
        varying float v_progress;
        varying float v_age;
      `,
      vertexMain: `
        v_age = u_time - time.x;
        v_progress = v_age / (time.y - time.x);

        if (v_progress < 0.0 || v_progress > 1.0) {
          csm_Position *= 0.0;;
        }
      `,
      fragmentHeader: `
        varying float v_progress;
        varying float v_age;
      `,
      fragmentMain: `
        /* Discard this instance if it is not in the current time range */
        if (v_progress < 0.0 || v_progress > 1.0) {
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
      attribute vec3 scale0;
      attribute vec3 scale1;
    `,
      vertexMain: `
      csm_Position *= mix(scale0, scale1, ${scaleFunction});
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
      attribute vec4 color0;
      attribute vec4 color1;
      varying vec4 v_color0;
      varying vec4 v_color1;
    `,
      vertexMain: `
      v_color0 = color0;
      v_color1 = color1;
    `,
      fragmentHeader: `
      varying vec4 v_color0;
      varying vec4 v_color1;
    `,
      fragmentMain: `
      /* Get diffuse color */
      vec4 diffuse4 = vec4(diffuse, 1.0);

      /* Apply the diffuse color */
      csm_DiffuseColor = mix(diffuse4 * v_color0, diffuse4 * v_color1, ${colorFunction});

      /* Mix in the texture */
      #ifdef USE_MAP
        csm_DiffuseColor *= texture2D(map, vUv);
      #endif
    `
    })
  )

  /* Soft particles */
  if (softness) {
    addModule(
      module({
        vertexHeader: `
          varying float v_viewZ;
        `,

        vertexMain: `
          vec4 viewPosition	= viewMatrix * instanceMatrix * modelMatrix * vec4(csm_Position, 1.0);
          v_viewZ = viewPosition.z;
        `,

        fragmentHeader: `
          uniform sampler2D u_depth;
          uniform vec2 u_resolution;
          uniform float u_cameraNear;
          uniform float u_cameraFar;

          varying float v_viewZ;

          float readDepth(vec2 coord) {
            float depthZ = texture2D(u_depth, coord).x;
            float viewZ = perspectiveDepthToViewZ(depthZ, u_cameraNear, u_cameraFar);
            return viewZ;
          }
        `,

        fragmentMain: `
          /* Normalize fragment coordinates to screen space */
          vec2 screenUv = gl_FragCoord.xy / u_resolution;

          /* Get the existing depth at the fragment position */
          float depth = readDepth(screenUv);

          {
            /* Prepare some convenient local variables */
            float d = depth;
            float z = v_viewZ;
            float softness = ${formatValue(softness)};

            /* Calculate the distance to the fragment */
            float distance = z - d;

            /* Apply the distance to the fragment alpha */
            csm_DiffuseColor.a *= ${softnessFunction};
          }
        `
      })
    )
  }

  return {
    vertexShader: compile(state.vertexHeaders, state.vertexMain),
    fragmentShader: compile(state.fragmentHeaders, state.fragmentMain),
    uniforms: {
      u_time: { value: 0 },
      u_depth: { value: null },
      u_cameraNear: { value: 0 },
      u_cameraFar: { value: 1 },
      u_resolution: { value: [window.innerWidth, window.innerHeight] }
    }
  }
}
