---
"render-composer": minor
---

**Render Composer was completely rewritten from scratch**. It now comes with its own JSX configuration layer for the `postprocessing` library, with `<RenderPipeline>` using that to construct its render passes. Because it's now much easier to declaratively add post-processing effects, `<RenderPipeline>` no longer sets them up by default. Instead, you can now add them as you see fit:

```tsx
import * as RC from "render-composer"

function App() {
  return (
    <RC.Canvas>
      <RC.RenderPipeline>
        <RC.EffectPass>
          <RC.SMAAEffect />
          <RC.SelectiveBloomEffect intensity={5} />
          <RC.VignetteEffect />
        </RC.EffectPass>

        {/* ...normal R3F stuff here. */}
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}
```
