import { $, Input, Snippet, Vec3 } from "@shader-composer/core"

/*
With many thanks to glNoise:
https://github.com/FarazzShaikh/glNoise/blob/master/src/GerstnerWave.glsl
*/

export const gerstnerWave = Snippet(
  (gerstnerWave) => $`
		vec3 ${gerstnerWave}(in vec2 p, in vec2 direction, in float steepness, in float wavelength, in float dt) {
			float k = 2.0 * PI / wavelength;
			float c = sqrt(9.8 / k);
			vec2 d = normalize(direction);
			float f = k * (dot(d, p.xy) - c * dt);
			float a = steepness / k;

			return vec3(d.x * (a * cos(f)), a * sin(f), d.y * (a * cos(f)));
		}
	`
)

export const GerstnerWave = (
  p: Input<"vec2">,
  direction: Input<"vec2"> = [1, 0],
  steepness: Input<"float"> = 1,
  wavelength: Input<"float"> = 1,
  offset: Input<"float"> = 0
) =>
  Vec3(
    $`${gerstnerWave}(${p}, ${direction}, ${steepness}, ${wavelength}, ${offset})`,
    {
      name: "Gerstner Wave"
    }
  )
