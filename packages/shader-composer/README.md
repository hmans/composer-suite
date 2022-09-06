![Shader Composer](https://user-images.githubusercontent.com/1061/181591252-3bf47e47-2f66-4a7a-bb40-762ff6141248.jpg)

[![Version](https://img.shields.io/npm/v/shader-composer?style=for-the-badge)](https://www.npmjs.com/package/shader-composer)
[![Downloads](https://img.shields.io/npm/dt/shader-composer.svg?style=for-the-badge)](https://www.npmjs.com/package/shader-composer)
[![Bundle Size](https://img.shields.io/bundlephobia/min/shader-composer?label=bundle%20size&style=for-the-badge)](https://bundlephobia.com/result?p=shader-composer)

## Summary

Write Three.js shaders, but with JavaScript! ✨

Shader Composer is a library for authoring Three.js shaders with JavaScript. It offers a lean, functional API that makes shader composition straight-forward and fun, while allowing for simple, low-friction reusability of your favorite shader functions.

Conceptually, it is modelled after node-based shader tools like Unity's Shader Graph, but fully commits to a code-first approach.

## Who is this for?

Shader Composer aims for a sweet spot between the ease of use of node-based tools and the flexibility of writing shaders by hand. However, it does _not_ entirely shield you from the underlying Three.js shader language, or the way shaders work in general, so ideally you should be familiar with GLSL to get the most out of it.

If you're _not_ familiar with authoring shaders and are looking for a quick way to get started, you might want to check out [Material Composer] instead. It builds on top of Shader Composer and provides a higher-level API for authoring materials from modules (which themselves are built using Shader Composer, and can often be customized using Shader Composer primitives.)

## Projects using Shader Composer

- **[Material Composer]**, providing a high-level API for authoring materials from layerable, shader-driven modules.
- **[VFX Composer](https://github.com/hmans/vfx-composer)**, a visual effects-focused GPU particles runtime for Three.js.

## Examples & Sandboxes

- **[Official Examples App](https://shader-composer-examples.vercel.app/)** ([CodeSandbox](https://codesandbox.io/p/github/hmans/shader-composer), [Source Code](https://github.com/hmans/shader-composer/tree/main/apps/examples/src/examples))

## How does it work?

Shader Composer's central API is the `compileShader` function, which takes the root of a tree of so-called **shader units**, compiles that tree into a shader, and returns it. You can then plug this shader into an instance of `THREE.ShaderMaterial`, or one of the other built-in Three.js materials with a little help from the excellent [three-custom-shader-material].

The root of your shader graph is typically a so-called **master unit**. The choice of which master unit to use will largely depend on the material you plan on using the shader in; Shader Composer provides master units for `THREE.ShaderMaterial` and the three-custom-shader-material library. (But it's easy to build your own in case you need it!)

Just like all other shader units, master units are just functions that return objects. An extremely simple shader graph designed for use with `THREE.ShaderMaterial` may look like this:

```js
const root = ShaderMaterialMaster({
  color: new Color("hotpink")
})
```

This unit can now be compiled and plugged into a `ShaderMaterial` instance:

```js
const [shader] = compileShader(root)
const material = new THREE.ShaderMaterial(shader)
```

The graph itself is pretty simple -- you will have guessed already that it merely sets the color of all fragments to `hotpink`. Let's make things a little more interesting:

```js
const root = ShaderMaterialMaster({
  color: Mul(new Color("hotpink"), Time())
})
```

Now we're multiplying the color by time! `Time` is a function that will set up and return a uniform node that contains the current time in seconds. `Mul` function is a function that multiplies two values together. These are just two units that are provided by Shader Composer, but there are many more -- and you can, of course, build your own!

## Functional Composition

Since shader units are typically created through functions, you can use functional composition to build up more complex shader graphs in a manner that keeps things easy to reason about. For example, let's say we want to create a shader that will multiply the color by the normalized sine value of the current time. A first implementation might look like the following:

```js
ShaderMaterialMaster({
  color: Mul(new Color("hotpink"), NormalizePlusMinusOne(Sin(Time())))
})
```

That's a lot of nesting! But we can import the `pipe` function from [fp-ts] or similar libraries and use it to make things a little more readable:

```ts
import { pipe } from "fp-ts/function"

const ModulateOverTime = (color: Input<"vec3">) =>
  pipe(
    Time(),
    (v) => Sin(v),
    (v) => NormalizePlusMinusOne(v),
    (v) => Mul(color, v)
  )

ShaderMaterialMaster({
  color: ModulateOverTime(new Color("hotpink"))
})
```

## Questions and Answers

#### Where is the node editor? I was expecting a node editor!

Shader Composer is a code-first library, and there is no intention for it to provide a graphical node-based editor (although it is certainly possible to do so, and maybe someone will eventually build one. Any takers? :D)

#### Does this reimplement Three.js's built-in materials?

No, but you can inject your custom shaders created with this library into Three.js's built-in materials through the provided `CustomShaderMaterialMaster` and [three-custom-shader-material]. And of course you can also just use it with `THREE.ShaderMaterial` like you would with any other custom shader.

#### Does this work with WebGPU, WebGL, ...?

Currently, only WebGL (GLSL) is supported, but adding support for WebGPU and WGSL is definitely possible and has a good chance of happening at some point.

#### Why are the graphs constructed from "units" and not "nodes"?

Because I wanted this library to be a little more unity.

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

[shadermaterial]: https://threejs.org/docs/#api/en/materials/ShaderMaterial
[three.js]: https://threejs.org/
[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
[three-custom-shader-material]: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
[glsl]: https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
[fp-ts]: https://github.com/gcanti/fp-ts
[material composer]: https://github.com/hmans/composer-suite/tree/main/packages/material-composer
