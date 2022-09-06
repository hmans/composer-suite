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

## Shader Update Callbacks

Shader units may optionally declare a JavaScript `update` callback that is expected to be invoked every frame. (For example, the `Time` unit uses this to update its uniform.)

Invoking this callback is the responsibility of the user, but Shader Composer makes it as easy as possible by returning a single `update` function as part of `compileShader`'s second return object:

```js
const [shader, { update }] = compileShader(root)
const material = new THREE.ShaderMaterial(shader)

function animate() {
  requestAnimationFrame(animate)
  update()
}

animate()
```

If you're using React-Three-Fiber, the [shader-composer-r3f] glue library has a hook that automates this. Please refer to the documentation of that library for details.

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

## Authoring Units

### Composition of existing units

Shader Composer provides an extensive collection of built-in units, and authoring your own units often means combining the built-in units into something new, like in the `ModulateOverTime` example above:

```ts
const ModulateOverTime = (color: Input<"vec3">) =>
  pipe(
    Time(),
    (v) => Sin(v),
    (v) => NormalizePlusMinusOne(v),
    (v) => Mul(color, v)
  )
```

**TypeScript note:** the two main types provided by Shader Composer are `Unit<T>` and `Input<T>`; `Unit<T>` describes an actual _unit_ of a specific GLSL type, while `Input<T>` describes a _possible input value_ of a specific GLSL type. The `Input<T>` type allows some extra flexibility in the way you can author your units, as it allows you to pass in either a `Unit<T>` or a plain JavaScript value of type `T`. (This is useful for things like colors, which use the GLSL type `vec3`, but `Input<T>` will allow you to pass an actual instance of `THREE.Color`.)

### Creating custom units

Alternatively, you can also author entirely custom units. This is done through the `Unit(type, value, config)` function. For example:

```ts
const color = Unit("vec3", new Color("hotpink"), {
  name: "My favorite color"
})
```

The first argument describes the GLSL type of the unit, the second its value. The third is an object containing configuration options.

### Unit types

Every unit in a Shader Composer graph has a specific type, and holds a value of that type. The type of a unit is a string that describes the GLSL type of the unit. For example, the `Time` unit has the type `float`, while the color unit we created abovehas the type `vec3`.

The unit's value must be compatible with this type. (In the generated GLSL, each unit creates a variable that holds its value.)

### Unit values

The second argument allows you to specify the unit's value. You have a few options here:

- A plain JavaScript value of the correct type. For example, a `float` unit can be initialized with a plain JavaScript number, or a `vec3` unit can be initialized with an instance of `THREE.Vector3`, an instance of `THREE.Color`, or an array holding three numbers.
- A reference to another unit. For example, you can create a `vec3` unit that holds the return value of a function returning a `vec3` unit, or any input compatible with it.
- An _expression_. Expressions allow you to construct verbatim GLSL code that will be inserted into the generated shader. They are built using tagged template literals, and unlike normal strings, are able to tie into the compiler's dependency management.

Let's have some examples. Here we're creating a unit of type `float` that holds a numerical value:

```ts
const number = Unit("float", 1.5)
```

Here we're changing the unit to hold the return value of a function:

```ts
const number = Unit("float", Add(1, 0.5))
```

And here we're using an expression to directly insert GLSL code into the shader. Shader Composer exports a `glsl` tagged template literal that can be used to create expressions, which is aliased to `$`:

```ts
const number = Unit("float", $`1 + 0.5`)
```

The above becomes a little more interesting when you turn it into a function that produces a unit:

```ts
const AddTwoNumbers = (a: Input<"float">, b: Input<"float">) =>
  Unit("float", $`${a} + ${b}`)
```

What the above unit does isn't terribly exciting, but there is one noteworthy aspect to it: consider that the two function arguments are typed `Input<"float">`. This means that the user of this function can pass any kind of value in that would be compatible with a `float` unit. For example, the user could pass in a plain JavaScript number, or a reference to another unit that produces a `float` value. The inputs could be entire hugely complex sub-graphs of your shader. The function itself doesn't care, it just takes the inputs and plugs them into the expression.

## Chunks

Most of the time, you will be dealing with units that hold values, but sometimes, you may need to create a unit that holds a chunk of GLSL body or header code. You can provide these through the configuration object (the third argument to the `Unit` function):

```ts
const ImperativelyDoSomething = Unit("float", 0, {
  fragment: {
    header: $`vec4 myColor = vec4(1.0, 0.0, 0.0, 1.0);`,
    body: $`gl_FragColor = myColor;`
  }
  /* Also possible for `vertex`, obviously. */
})
```

> **Warning** It is generally recommended to _not_ use chunks for anything that can be done another way. Chunks should be considered a last resort, and be used sparingly, as they can make your shader graph harder to reason about, and increase the risk of namespace collisions.

## Snippets

**TODO**

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
[shader-composer-r3f]: https://github.com/hmans/composer-suite/tree/main/packages/shader-composer-r3f
[material composer]: https://github.com/hmans/composer-suite/tree/main/packages/material-composer

```

```
