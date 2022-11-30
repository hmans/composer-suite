---
"shader-composer": minor
"@shader-composer/core": minor
"@shader-composer/noise": minor
"@shader-composer/postprocessing": minor
"@shader-composer/r3f": minor
"@shader-composer/three": minor
"shader-composer-toybox": minor
---

**Breaking:** Shader Composer has received a new package structure! Its code is now spread across multiple smaller packages scoped within the `@shader-composer/*` organization, with the main `shader-composer` package acting as an umbrella package.

The user can now choose between either picking the scoped packages they need, or just using the umbrella package, which provides additional entrypoints for specific frameworks and libraries.

Example for working with individual scoped packages:

```js
import { compileShader } from "@shader-composer/core"
import { setupThree } from "@shader-composer/three"
import { PostProcessingEffectMaster } from "@shader-composer/postprocessing"
```

TODO: finalize examples
