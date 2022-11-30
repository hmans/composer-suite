import { $, Float, Input, Snippet } from "@shader-composer/core"
import { psrdnoise3 } from "./PSRDNoise"

export const turbulence3D = Snippet(
  (turbulence3D) => $`
			float ${turbulence3D}(vec3 p, float octaves) {
				float t = -0.5;

        float alpha = 0.0;
        vec3 period;
        vec3 gradient;

				for (float f = 1.0 ; f <= octaves; f++) {
					float power = pow(2.0, f);
          float noise = ${psrdnoise3}(vec3(power * p), period, alpha, gradient);
					t += abs(noise / power);
				}

				return t;
			}
		`
)

export const Turbulence3D = (p: Input<"vec3">, octaves: Input<"float"> = 10) =>
  Float($`${turbulence3D}(${p}, ${octaves})`, { name: `Turbulence3D` })
