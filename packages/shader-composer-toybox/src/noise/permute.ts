import { glsl, Snippet } from "shader-composer"
import { mod289 } from "./mod289"

export const permute = Snippet(
	(name) =>
		glsl`
			vec4 ${name}(vec4 x)
			{
				return ${mod289}(((x*34.0)+10.0)*x);
			}
		`
)
