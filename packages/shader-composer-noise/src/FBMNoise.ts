import { $, Float, Input, Int, Snippet, type } from "@shader-composer/core"
import { pnoise } from "./PerlinNoise"

export type FBMOptions = {
  seed?: Input<"float">
  persistance?: Input<"float">
  lacunarity?: Input<"float">
  scale?: Input<"float">
  redistribution?: Input<"float">
  octaves?: Input<"int">
  turbulence?: Input<"bool">
  ridge?: Input<"bool">
}

export const FBMNoise = (
  p: Input<"vec2" | "vec3">,
  {
    seed = 0,
    persistance = 0,
    lacunarity = 0,
    scale = 1,
    redistribution = 1,
    octaves = Int(1),
    turbulence = true,
    ridge = true
  }: FBMOptions = {}
) =>
  Float(
    $`${fbmNoise}(${p}, ${fbmNoise}Opts(
			${seed},
			${persistance},
			${lacunarity},
			${scale},
			${redistribution},
			${octaves},
			${turbulence},
			${ridge}))`,
    {
      name: `FBMNoise ${type(p)}`
    }
  )

const fbmNoise = Snippet(
  (fbmNoise) => $`
		#define MAX_FBM_ITERATIONS 30

		struct ${fbmNoise}Opts {
			float seed;
			float persistance;
			float lacunarity;
			float scale;
			float redistribution;
			int octaves;
			bool turbulence;
			bool ridge;
		};

		float ${fbmNoise}(vec2 p, ${fbmNoise}Opts opts) {
			p += (opts.seed * 100.0);
			float persistance = opts.persistance;
			float lacunarity = opts.lacunarity;
			float redistribution = opts.redistribution;
			int octaves = opts.octaves;
			bool turbulence = opts.turbulence;
			bool ridge = opts.turbulence && opts.ridge;

			float result = 0.0;
			float amplitude = 1.0;
			float frequency = 1.0;
			float maximum = amplitude;

			for (int i = 0; i < MAX_FBM_ITERATIONS; i++) {
				if (i >= octaves)
					break;

				vec2 p = p * frequency * opts.scale;

				float noiseVal = ${pnoise}(p);

				if (turbulence)
					noiseVal = abs(noiseVal);

				if (ridge)
					noiseVal = -1.0 * noiseVal;

				result += noiseVal * amplitude;

				frequency *= lacunarity;
				amplitude *= persistance;
				maximum += amplitude;
			}

			float redistributed = pow(result, redistribution);
			return redistributed / maximum;
		}

		float ${fbmNoise}(vec3 p, ${fbmNoise}Opts opts) {
			p += (opts.seed * 100.0);
			float persistance = opts.persistance;
			float lacunarity = opts.lacunarity;
			float redistribution = opts.redistribution;
			int octaves = opts.octaves;
			bool turbulence = opts.turbulence;
			bool ridge = opts.turbulence && opts.ridge;

			float result = 0.0;
			float amplitude = 1.0;
			float frequency = 1.0;
			float maximum = amplitude;

			for (int i = 0; i < MAX_FBM_ITERATIONS; i++) {
				if (i >= octaves)
					break;

				vec3 p = p * frequency * opts.scale;

				float noiseVal = ${pnoise}(p);

				if (turbulence)
					noiseVal = abs(noiseVal);

				if (ridge)
					noiseVal = -1.0 * noiseVal;

				result += noiseVal * amplitude;

				frequency *= lacunarity;
				amplitude *= persistance;
				maximum += amplitude;
			}

			float redistributed = pow(result, redistribution);
			return redistributed / maximum;
		}
	`
)
