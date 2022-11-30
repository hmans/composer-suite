---
"shader-composer": minor
"@shader-composer/core": minor
"@shader-composer/r3f": minor
"@shader-composer/three": minor
---

**Breaking:** The core Shader Composer package `@shader-composer/core` no longer requires Three.js as a peer dependency, and is now ready to be used together with other frameworks (or directly with WebGL.)

Since some of the units provided within the standard library require framework-specific code to operate (like `CameraFar`, `CameraNear`, `Resolution` etc.), glue code needs to be created to use Shader Composer with other frameworks.

The Three.js glue code lives in the `@shader-composer/three` package.

TODO: example for usage
