# @shader-composer/three

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
