export const vertexShader = /* glsl */ `
uniform float u_time;

attribute vec2 time;
attribute vec3 velocity;
attribute vec3 acceleration;
attribute vec4 colorStart;
attribute vec4 colorEnd;
attribute vec3 scaleStart;
attribute vec3 scaleEnd;

varying float v_timeStart;
varying float v_timeEnd;
varying float v_progress;
varying float v_age;
varying vec4 v_colorStart;
varying vec4 v_colorEnd;

vec3 applyQuaternionToVector(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main() {
  /* Set varyings */
  v_timeStart = time.x;
  v_timeEnd = time.y;
  v_colorStart = colorStart;
  v_colorEnd = colorEnd;
  v_age = u_time - v_timeStart;
  v_progress = v_age / (v_timeEnd - v_timeStart);

  /* Apply velocity and acceleration */
  vec3 offset = vec3(v_age * velocity + 0.5 * v_age * v_age * acceleration);

  /* Apply scale */
  csm_Position *= mix(scaleStart, scaleEnd, v_progress);
  // csm_Position *= 1.0;

  /* Fixes rotation, but not scaling, argh! */
  offset *= mat3(instanceMatrix);
  csm_Position += offset;
}

`

export const fragmentShader = /* glsl */ `
uniform float u_time;

varying float v_progress;
varying float v_age;
varying float v_timeStart;
varying float v_timeEnd;
varying vec4 v_colorStart;
varying vec4 v_colorEnd;

void main() {
  /* Discard this instance if it is not in the current time range */
  if (u_time < v_timeStart || u_time > v_timeEnd) discard;

  vec4 diffuse4 = vec4(diffuse, 1.0);
  csm_DiffuseColor = mix(diffuse4 * v_colorStart, diffuse4 * v_colorEnd, v_progress);
  // csm_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  csm_FragColor = texture2D(map, vUv) * csm_DiffuseColor;
}
`
