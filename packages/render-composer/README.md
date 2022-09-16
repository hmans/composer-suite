# Render Composer

A pre-configured render pipeline for your react-three-fiber games. It is meant to provide some sane defaults for rendering your game, making it easy to make it look fancy, but also providing some tooling like a pre-render pass providing render and depth textures to shaders that need them.

## tl;dr

```tsx
import * as RC from "render-composer"

function App() {
  return (
    <RC.Canvas>
      <RC.RenderPipeline>
        {/* Just do normal R3F stuff inside. */}
        <directionalLight position={[30, 10, 10]} intensity={1.5} />
        <mesh>
          <icosahedronGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}
```

## Customizing Canvas

`<RC.Canvas>` is just a thin wrapper around react-three-fiber's `<Canvas>` that applies some configuration that Render Composer needs to operate as expected. You can override any of the props if you want to:

```tsx
import * as RC from "render-composer"

function App() {
  return (
    <RC.Canvas frameloop="demand">
      <RC.RenderPipeline>{/* etc. */}</RC.RenderPipeline>
    </RC.Canvas>
  )
}
```

Alternatively, you may use your own `<Canvas>`; but if you do this, please make sure it sets the `flat` property:

```tsx
import { Canvas } from "@react-three/fiber"
import * as RC from "render-composer"

function App() {
  return (
    <Canvas flat>
      <RC.RenderPipeline>{/* etc. */}</RC.RenderPipeline>
    </Canvas>
  )
}
```

## Adding full-screen post-processing effects

Render Composer provides React component wrappers around (some of) the post-processing effects from [postprocessing]. In your project, just create additional effect passes as you see fit:

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

These components expose the same props as the original postprocessing effects, but should all in all be considered work-in-progress.

## Custom Render Pipelines

TODO

## License

```
Copyright (c) 2022 Hendrik Mans

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

[postprocessing]: https://github.com/pmndrs/postprocessing
