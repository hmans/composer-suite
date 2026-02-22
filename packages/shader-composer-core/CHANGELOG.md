# @shader-composer/core

## 0.5.0

### Minor Changes

- d504e35: **Breaking:** The casting helpers (eg. `$vec3()`, `$mat3()` etc.) have been renamed to `vec3()`, `mat3()` etc., and have had their signature changed. Where the old implementations were able to take any number of arguments, the new helpers will only ever take _a single argument_. (If you want to cast multiple arguments, you can pass an array.)

  ```js
  /* Before: */
  $vec3(1, 2, 3)

  /* After: */
  vec3([1, 2, 3])
  ```

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

- 4f9903d: **Breaking Change:** `ShaderMaterialMaster` and `CustomShaderMaterialMaster` have been renamed to `ShaderMaterialRoot` and `CustomShaderMaterialRoot`.
- 1e313b5: Added two new units: `FrameTime` and `FrameCount`.

  `FrameTime` is a unit that represents the time in seconds since the application started. Most importantly, this value is guaranteed to be stable across the duration of a frame, so it's perfect for synchronizing multiple shaders.

  `FrameCount` provides an integer counter of the number of frames rendered since the start of the application. This, too, is great for synchronizing shaders, and might be better for when you need an auto-increasing integer value instead of a floating point time value.

  If you need these values in your JavaScript `update` callbacks, you can import the new `frame` object and access its `time` and `count` properties.

- d504e35: **Breaking:** The core Shader Composer package `@shader-composer/core` no longer requires Three.js as a peer dependency, and is now ready to be used together with other frameworks (or directly with WebGL.)

  Since some of the units provided within the standard library require framework-specific code to operate (like `CameraFar`, `CameraNear`, `Resolution` etc.), glue code needs to be created to use Shader Composer with other frameworks.

  The Three.js glue code lives in the `@shader-composer/three` package.

  TODO: example for usage

- d504e35: **New:** Arrays of specific lengths are now automatically casts to vectors and matrices; an array with 2 elements will be rendered as a `vec2`, an array with 3 elements will be rendered as a `vec3`, and so on.

  ```js
  /* Before, and this still works: */
  ScaleAndOffset(value, Vec2([0.5, 0.5]), Vec2([0.5, 0.5]))

  /* But now this is also possible: */
  ScaleAndOffset(value, [0.5, 0.5], [0.5, 0.5])
  ```

  If you want to cast an array to a specific type, you can use the `vec2()`, `vec3()` etc. helpers:

  ```js
  ScaleAndOffset(value, vec2([0.5, 0.5]), vec2([0.5, 0.5]))
  ```

  Or wrap them in full units, like above.
