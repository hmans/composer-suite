# /Shádenfreude/, German: the joy of writing shaders

## Introduction

Creating shaders from node graphs is fun -- users of engines like Unity or Unreal Engine do it all the time! Shadenfreude aims at **providing a node-based shader composition experience from a code-first perspective**, designed for use with [Three.js].

If you've always liked the idea of composing shaders from node graphs, but secretly preferred doing it through code, then I am happy to admit that you are just like me, and that I have created Shadenfreude for people like us. Let's go! 🚀

> **Warning**
>
> This library is very extremely new. I'd love for you to give it a go and maybe provide some feedback, but I would currently recommend **strongly** against using it in any sort of production project, unless you're ready and willing to keep up with the changes every release. **Use at your own risk.**

## Features

- Rapidly create powerful [Three.js] shaders using a library of ready-to-use nodes, or add your own!
- Nodes are just plain JavaScript objects, and they can implement anything from tiny pieces of processing, up to big monolithic behemoths of shader code!
- Use all the language tools you already know to wrap individual branches into reusable, distributable components!
- Developed in Typescript, with fantastic type support out of the box!
- Compact library, lots of tests.

Shadenfreude also has a couple of non-features:

- It does not provide a full node-based reimplementation of Three.js' built-in materials.
- It does not provide a graphical shader node editing environment, and does not aim to do this or even support this in the future, even though there are some fun ideas for debugging tools that will provide a similar experience.
- It currently only supports Three.js' `WebGLRenderer`, but WebGPU support is on the table. Maybe not today's table, but definitely a future table. :)

## Examples & Sandboxes

This document is going to explain the basics of writing shaders using Shadenfreude and developing your own nodes, but the best way to dive in probably is to check out one of the many great examples[^1].

- **[The official Shadenfreude sandbox](https://codesandbox.io/s/github/hmans/shadenfreude-sandbox?file=/src/App.js)**. Fork it and go nuts!

[^1]: What do you mean, there aren't many examples listed here yet? Come on, cut me some slack, this library didn't even exist two weeks ago!

## Basic Use

> **Warning**
>
> This library is pretty young, and so is its documentation. Since the library is still in a lot of flux, the documentation currently focuses on just the basics, and assumes that you already have a certain amount of familiarity with writing shaders.

### With THREE.ShaderMaterial

```ts
/* Shaders usually start with a master */
const root = ShaderMaterialMaster({
  color: new Color("hotpink")
})

/* Compile the shader. */
const [shader, update] = compileShader(root)

/* Pass the `shader` object into the ShaderMaterial constructor */
const material = new THREE.ShaderMaterial(shader)

/* And call `update` in your game loop. */
function animate(dt: number) {
  /* ... */
  update(dt)
}
```

### With CustomShaderMaterial

The excellent [three-custom-shader-material] allows you to inject shader code into Three.js' built-in shaders to modify their behavior. Use it just like above, but with a `CustomShaderMaterialMaster`:

```ts
/* Shaders usually start with a master */
const root = CustomShaderMaterialMaster({
  diffuseColor: new Color("hotpink")
})
```

### Variables

Everything in Shadenfreude is expressed as a **Variable**. That may sound a bit boring at first, but Variables are pretty powerful: they can inject their own shader code, declare what other variables they depend on, define and invoke functions, or just plain calculate stuff. Shadenfreude will compile your shader from a tree of these variables.

But let's start at the beginning. You can construct variables using the `Variable` function:

```ts
const f = Variable("float", 1)
```

The first argument is a GLSL type, the second the variable's value. Since you will be creating a lot of variables this way, there's also a set of helpers for the individual types:

```ts
const f = Float(1)
const v3 = Vec3(new Vector3())
const b = Bool(true)
```

Variables can reference other variables:

```ts
const color = Vec3(new Color("hotpink"))
const other = Vec3(color)
```

You can perform mathematical operations on variables:

```ts
const color = Vec3(new Color("hotpink"))
const modifiedColor = Multiply(color, 2)
```

Now let's use that modified color as the material's main color:

```ts
const color = Vec3(new Color("hotpink"))
const modifiedColor = Multiply(color, 2)

const root = CustomShaderMaterialMaster({
  diffuseColor: modifiedColor
})
```

How about animating the color intensity over time?

```ts
const color = Vec3(new Color("hotpink"))

const sinusTime = Sin(Time)

const animatedColor = Multiply(color, Add(sinusTime, 1))

const root = CustomShaderMaterialMaster({
  diffuseColor: animatedColor
})
```

How about making this time color animation reusable? Just write a function!

```ts
const AnimateColor = (color: Vec3) => Multiply(color, Add(Sin(Time), 1))

const root = CustomShaderMaterialMaster({
  diffuseColor: AnimateColor(new Color("hotpink"))
})
```

There you go, you've built your first animated shader with Shadenfreude! Now go crazy!

### Math Operators

TODO

### Pipes

TODO

## Advanced Use

### Value Types

TODO

### Creating your own variable types

TODO

### Defining shader chunks

TODO

### Defining functions

TODO

[shadermaterial]: https://threejs.org/docs/#api/en/materials/ShaderMaterial
[three.js]: https://threejs.org/
[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
[three-custom-shader-material]: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
