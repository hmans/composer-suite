import { glsl, Snippet } from "@shader-composer/core"

export const rand = Snippet(
  (rand) => glsl`
		float ${rand}(float n) { return fract(sin(n) * 1e4); }

		float ${rand}(vec2 p) {
			return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) *
									 (0.1 + abs(sin(p.y * 13.0 + p.x))));
		}
	`
)

export const rand2 = Snippet(
  (rand2) => glsl`
		vec2 ${rand2}(vec2 p) {
			return fract(
				sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453
			);
		}
	`
)

export const rand3 = Snippet(
  (rand3) => glsl`
		vec2 ${rand3}(vec3 p) {
			return mod(((p * 34.0) + 1.0) * p, 289.0);
		}
	`
)

export const rand4 = Snippet(
  (rand4) => glsl`
		vec4 ${rand4}(vec4 p) { return mod(((p * 34.0) + 1.0) * p, 289.0); }
	`
)
