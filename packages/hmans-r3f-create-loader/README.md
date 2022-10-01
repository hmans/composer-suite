# createLoader

`createLoader` creates a loader hook for a resource served through HTTP,
and will automatically queue it for preloading. This allows you to create bundles of assets that are preloaded in one go, at the time of import, rather than at the time of first use, while also simplifying your code by moving the assets' URL strings to a central module.

## Example

In a module in your project (eg. `assets.ts`):

```js
import { createLoader } from "@hmans/r3f-create-loader"
/* ...import loaders... */

export const useAsset = {
  asteroid: createLoader(GLTFLoader, "/models/asteroid.gltf"),
  music: createLoader(AudioLoader, "/sounds/music.mp3"),
  fog: createLoader(TextureLoader, "/textures/fog.png")
}
```

In a component that uses one of these assets:

```js
import { useAsset } from "./assets"

function Asteroid() {
  /* Equivalent to `useTexture("/textures/fog.png")`, but you can't get the URL
  wrong and the preloading is triggered at time of importing `assets.ts`. */
  const fog = useAsset.fog()

  return /* ... */
}
```

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
