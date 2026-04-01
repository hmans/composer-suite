# shader-composer-r3f

## 0.5.0

### Minor Changes

- d504e35: **Breaking:** Shader Composer has received a new package structure! Its code is now spread across multiple smaller packages scoped within the `@shader-composer/*` organization, with the main `shader-composer` package acting as an umbrella package.

  The user can now choose between either picking the scoped packages they need, or just using the umbrella package, which provides additional entrypoints for specific frameworks and libraries.

  Example for working with individual scoped packages:

  ```js
  import { compileShader } from "@shader-composer/core"
  import { PSRDNoise3D } from "@shader-composer/noise"
  import setupThree from "@shader-composer/three"
  import { PostProcessingEffectRoot } from "@shader-composer/postprocessing"

  setupThree()
  ```

  For convenience, you can also use the `shader-composer` umbrella package. It directly exports most of the functions and units you'll need for building shaders, and provides additional entrypoints for framework-specific functionality:

  ```js
  import { compileShader, PSRDNoise3D } from "shader-composer"
  import setupThree from "shader-composer/three"
  import { PostProcessingEffectRoot } from "shader-composer/postprocessing"

  setupThree()
  ```

- d504e35: **Breaking:** The core Shader Composer package `@shader-composer/core` no longer requires Three.js as a peer dependency, and is now ready to be used together with other frameworks (or directly with WebGL.)

  Since some of the units provided within the standard library require framework-specific code to operate (like `CameraFar`, `CameraNear`, `Resolution` etc.), glue code needs to be created to use Shader Composer with other frameworks.

  The Three.js glue code lives in the `@shader-composer/three` package.

  TODO: example for usage

- 4f9903d: **Breaking Change:** `ShaderMaster` has been renamed to `ShaderRoot`.

### Patch Changes

- Updated dependencies [4f9903d]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
- Updated dependencies [d504e35]
  - @material-composer/patch-material@0.2.0
  - @shader-composer/three@0.5.0

## 0.4.5

### Patch Changes

- d3e2b88: **New:** `shader-composer-r3f` now provides its own mechanism for patching Three.js materials through its new `ShaderMaster` master unit and `<Shader>` React component:

  ```tsx
  function MyShadedThingy() {
    const shader = useShader(() => {
      return ShaderMaster({
        color: /* ... */
        position: /* ... */
        /* etc. */
      })
    }, [])

    return (
      <mesh>
        <boxGeometry />

        <meshStandardMaterial>
          <Shader {...shader} />
        </meshStandardMaterial>
      </mesh>
    )
  }
  ```

- Updated dependencies [a962a31]
  - shader-composer@0.4.5

## 0.4.0

### Minor Changes

- c3dcb12: **Breaking Change:** Removed the `Custom.*` proxy for CustomShaderMaterial. (You were probably not using it, but who knows!) For a similar proxy-based system, please use `@material-composer/patched`.

### Patch Changes

- Updated dependencies [a92d0d3]
- Updated dependencies [433f93b]
- Updated dependencies [765b29d]
- Updated dependencies [9406986]
- Updated dependencies [6d99c19]
- Updated dependencies [765b29d]
  - shader-composer@0.4.0

## 0.2.0

### Breaking Changes

- 104be03: **Breaking Change:** `Uniform` is now called `UniformUnit`. The r3f package's `useUniform` is now `useUniformUnit`.

### Minor Changes

- a4739b1: `shader-composer-r3f` now includes `three-custom-shader-material` as a dependency.
- 7822988: Uses new `update` syntax from Shader Composer 0.3.0.
- 725ab24: Added a `<Custom.* />` component that wraps all the available Three.js materials (making use of the [three-custom-shader-material](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) library), making it super-easy to create instances of these materials using your custom shaders:

  ```jsx
  <mesh castShadow receiveShadow>
    <dodecahedronGeometry args={[2, 5]} />

    <Custom.MeshStandardMaterial
      {...shader}
      flatShading
      metalness={0.5}
      roughness={0.5}
    />

    <Custom.MeshDepthMaterial {...depthShader} />
  </mesh>
  ```

- a4739b1: Added `<CustomDepthMaterial>` for easy-as-pie custom depth materials.

## 0.1.1

### Patch Changes

- 91b74eb: **Added:** `useUniform` now allows the user to pass an optional third argument, `config`, which is the custom unit configuration to mix into the created uniform (analogous to the third argument of Shader Composer's `Uniform()`.) Among other things, this allows you to explicitly configure the uniform's GLSL name by passing a `uniformName` property as part of this object.

## 0.1.0

### Minor Changes

- 74e6d2a: **Breaking Change:** The return signature of `compileShader` has been changed. It now returns `[shader, meta]`, where `shader` is the object containing the shader properties (like before), and `meta` is an object containing the `update` function, and a `units` array containing all units used in the tree.

## 0.0.5

### Patch Changes

- b59783e: New hook, `useUniform`. Will create a uniform of the specified type, and effectfully update its value when the passed value changes. Example:

  ```js
  const uniform = useUniform("float", 1)
  ```

## 0.0.4

### Patch Changes

- c2157ff: We're trying prereleases! Let's go!

## 0.0.4-next.0

### Patch Changes

- c2157ff: We're trying prereleases! Let's go!
- Updated dependencies [c2157ff]
  - shader-composer@0.0.4-next.0

## 0.0.3

### Patch Changes

- cc339f2: Bump version to fix changesets. :(
- Updated dependencies [cc339f2]
  - shader-composer@0.0.3

## 0.0.2

### Patch Changes

- 7e1d721: First release!
- Updated dependencies [7e1d721]
  - shader-composer@0.0.2
