import { flow, identity } from "fp-ts/function"
import { IUniform, Material } from "three"

export type PatchedMaterialOptions = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: { [key: string]: IUniform }
}

export const patchMaterial = <M extends Material>(
  material: M,
  { vertexShader, fragmentShader, uniforms = {} }: PatchedMaterialOptions = {}
) => {
  const transformVertexShader = flow(
    injectGlobalDefines(material),
    vertexShader ? injectProgram(vertexShader) : identity,
    injectPosition,
    injectNormal
  )

  const transformFragmentShader = flow(
    injectGlobalDefines(material),
    fragmentShader ? injectProgram(fragmentShader) : identity,
    injectRoughnessAndMetalness,
    injectColorAndAlpha,
    injectEmissive
  )

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = transformVertexShader(shader.vertexShader)
    shader.fragmentShader = transformFragmentShader(shader.fragmentShader)
    shader.uniforms = { ...shader.uniforms, ...uniforms }
  }

  /* TODO: Be smarter about the cache key :D */
  const cacheKey = String(Math.random())
  material.customProgramCacheKey = () => cacheKey
}

const parseProgram = (program: string) => {
  const r = new RegExp(/(.*)void\s+main\(\)\s+{(.*)}/s)
  const matches = r.exec(program)

  if (!matches) {
    throw new Error("Could not parse shader program. Boo!")
  }

  return {
    header: matches[1],
    body: matches[2]
  }
}

export const extend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${anchor}\n${target}`)
})

export const prepend = (anchor: string) => ({
  with: (target: string) => (source: string) =>
    source.replace(anchor, `${target}\n${anchor}`)
})

export const replace = (anchor: string) => ({
  with: (target: string) => (source: string) => source.replace(anchor, target)
})

const injectGlobalDefines = (material: Material) =>
  flow(
    prepend("void main() {").with(`#define IS_${material.type.toUpperCase()};`)
  )

const injectProgram = (program: string) => {
  const parsed = parseProgram(program)

  return flow(
    prepend("void main() {").with(parsed.header),
    extend("void main() {").with(parsed.body)
  )
}

const injectPosition = flow(
  extend("void main() {").with("vec3 patched_Position = position;"),
  extend("#include <begin_vertex>").with("transformed = patched_Position;")
)

const injectNormal = flow(
  extend("void main() {").with("vec3 patched_Normal = normal;"),
  replace("#include <beginnormal_vertex>").with(`
    vec3 objectNormal = patched_Normal;
    #ifdef USE_TANGENT
      vec3 objectTangent = vec3( tangent.xyz );
    #endif
  `)
)

const injectColorAndAlpha = flow(
  extend("void main() {").with(`
    #if defined IS_SHADERMATERIAL || defined IS_MESHDEPTHMATERIAL || defined IS_MESHNORMALMATERIAL
      vec3 patched_Color = vec3(1.0, 0.0, 0.0);
      float patched_Alpha = 1.0;
    #else
      vec3 patched_Color = diffuse;
      float patched_Alpha = opacity;
    #endif

    #ifdef USE_MAP
      vec4 _patched_map_sample = texture2D(map, vUv);
      patched_Color *= _patched_map_sample.rgb;
      patched_Alpha *= _patched_map_sample.a;
    #endif
  `),
  extend("#include <color_fragment>").with(
    "diffuseColor = vec4(patched_Color, patched_Alpha);"
  )
)

const injectEmissive = flow(
  extend("void main() {").with(`
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
    vec3 patched_Emissive = emissive;
    #else
    vec3 patched_Emissive = vec3(1.0, 1.0, 1.0);
    #endif
  `),
  replace("vec3 totalEmissiveRadiance = emissive;").with(
    "vec3 totalEmissiveRadiance = patched_Emissive;"
  )
)

const injectRoughnessAndMetalness = flow(
  extend("void main() {").with(`
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
    float patched_Roughness = roughness;
    float patched_Metalness = metalness;
    #else
    float patched_Roughness = 0.0;
    float patched_Metalness = 0.0;
    #endif
  `),
  extend("#include <roughnessmap_fragment>").with(
    "roughnessFactor = patched_Roughness;"
  ),
  extend("#include <metalnessmap_fragment>").with(
    "metalnessFactor = patched_Metalness;"
  )
)
