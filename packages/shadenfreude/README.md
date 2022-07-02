# /Shádenfreude/, German: the joy of writing shaders

## Introduction

Shadenfreude is a library for programmatically creating [Three.js] shaders assembled from a graph of nodes. It provides a library of ready-to-use nodes, but you can also create your own.

## Basic Use

### Hello World

Shadenfreude compiles a working GLSL shader from a tree of JavaScript objects, each implementing a small piece of functionality. Compilation always starts with a single root node, also called a "master node"; this library provides a couple of these master nodes for different usage scenarios. Let's start with creating a Three.js [ShaderMaterial] and assigning a simple shader to it:

```jsx
/* Create a shader node */
const root = ShaderMaterialMasterNode({
  color: new THREE.Color("hotpink")
})

/* Compile the shader */
const [_, shader] = compileShader(root)

/* Create a material and assign the compiled shader */
const material = new THREE.ShaderMaterial(shader)
```

### Variables

Most of the time, nodes have input and output variables that can be wired up to let one node's output value flow into another node's input. Building on the previous example, let's use a `MixNode` to mix together two colors:

```jsx
const root = ShaderMaterialMasterNode({
  color: MixNode({
    a: new THREE.Color("hotpink"),
    b: new THREE.Color("green"),
    amount: 0.5
  })
})
```

Okay, ignoring the fact that the resulting color is going to look unfathomably terrible, something very important is going to happen here: the colors will not be mixed on the CPU, but _within the compiled shader_.

### Explicit Variable Assignment

Instead of assigning inputs at time of instantiation, you can also do it imperatively after nodes have been created. The previous example can be rewritten like this:

```jsx
const colorA = new THREE.Color("hotpink")
const colorB = new THREE.Color("green")

const mixedColor = MixNode()
plug(colorA).into(mixedColor) /* uses the "a" variable by default */
plug(colorB).into(mixedColor.in.b)
plug(0.5).into(mixedColor.in.amount)

const root = ShaderMaterialMasterNode()
plug(mixedColor).into(root.in.color)
```

### Animations

Of course, mixing two static color values together isn't terribly exciting, so now let's animate the mixing over time:

```jsx
const root = ShaderMaterialMasterNode({
  color: MixNode({
    a: new THREE.Color("hotpink"),
    b: new THREE.Color("green"),
    amount: DivideNode({
      value: TimeNode(),
      other: 10
    })
  })
})
```

Wait, what, woah? Okay, let's go through this from the inside out:

- `TimeNode` is a node that represents the current time (in seconds since the material was created.)
- `DivideNode` will divide the provided `value` by the `other` argument, so here we're dividing the current time value by 10 to slow things down a little.
- The resulting value of `DivideNode` is passed into the `amount` property of our `MixNode`, meaning that this value will now slowly move from `0` to `1` over the course of the first 10 seconds.

And all this is going to happen within the shader!

However, we're going to have to do one more thing to make it work. If you're familiar with shader programming, you might have guessed that `TimeNode` uses something called a `uniform` variable -- a global constant variable in the shader whose value is set and updated from within JavaScript. `TimeNode` will set up the uniform and also ships with the code that will update it, but in order for all of this to work, we still need to invoke the update callback that `compileShader` returns as its first return value:

```jsx
/* Compile the shader, but this time grab the update callback */
const [update, shader] = compileShader(root)

/* Create a material and assign the compiled shader, like before */
const material = new THREE.ShaderMaterial(shader)

/* Somewhere within your render loop, call the update callback, and
   pass the frame delta to it: */
function animate(dt) {
  update(dt)

  /* [ ...your stuff here ... ] */

  /* Request next tick */
  requestAnimationFrame(animate)
}
```

### Adding some Structure

Now you can put all your Shadenfreude and JavaScript knowledge to work and split things into functions, almost like you'd do in your favorite component framework:

```jsx
const AnimateColor = ({ a, b, duration = 1 }) =>
  MixNode({
    a,
    b,
    amount: DivideNode({
      value: TimeNode(),
      other: duration
    })
  })

const root = ShaderMaterialMasterNode({
  color: AnimateColor({
    a: new THREE.Color("hotpink"),
    b: new THREE.Color("green"),
    duration: 10
  })
})
```

## Creating Custom Nodes

### The `ShaderNode` factory

At the most basic level, shader nodes are simple JavaScript objects extending the `IShaderNode` interface. Since they require a tiny bit of initialization, you should use the `ShaderNode` factory to create them.

Here's a simple example:

```js
const node = ShaderNode({
  name: "I'm a shader node that doesn't do anything!"
})
```

Shader nodes can declare GLSL code, variables and filters; variables are typically input and output variables, but can also be varyings, uniforms, and attributes. Filters are a powerful feature that allows you to set up complete processing chains; more on these later.

Let's create a node that adds two floats:

```js
const node = ShaderNode({
  in: {
    a: variable("float", 0),
    b: variable("float", 0)
  },
  out: {
    value: variable("float")
  },
  vertex: {
    body: "out_value = in_a + in_b;"
  },
  fragment: {
    body: "out_value = in_a + in_b;"
  }
})
```

Let's go through these from top to bottom and discuss some of the things we're seeing here.

- First of all, note that **the `name` property is entirely optional**. It is, however, _recommended_ that you set it; if the shader compilation ever fails, this will help you tremendously on your hunt for the cause.
- We're **declaring two `in` variables**, `a` and `b`.
- Each of these is declared as `variable("float", 0)`. This is how we tell the compiler that we want them to have the GLSL `float` type, and a default value of `0` if nothing else is assigned to them.
- We're also **declaring an `out` variable** called `value`. Note that it doesn't have a default value.
- Shaders are composed of two programs, the **vertex shader and the fragment shader**, and Shadenfreude allows us to declare code for both. Here, we need to set the output variable, and since the node can be used in both programs, we need to supply the same chunk for both, too.
- Note that within the generated GLSL code, **input and output variables are prefixed** with `in_` and `out_`, respectively.

This is all a bit verbose, so let's make it a bit leaner:

```js
const node = ShaderNode({
  in: {
    a: float(0),
    b: float(0)
  },
  out: {
    value: float("in_a + in_b")
  }
})
```

This version is functionally equivalent to the one before, but we're doing some things differently:

- Note how we're using the `float(v)` variable factory -- it's just a shortcut for `variable("float", v)`.
- Instead of imperatively writing the calculated result value into `out_value`, we're providing a string default value for the `value` out variable. When variables have string values, the string will be used in the generated GLSL verbatim, and we can use this here to our advantage.

### Writing a reusable shader node

We've been creating standalone shader nodes so far, but what if we want to be able to create multiple instances of the same node? Well, just do what you would normally do in JavaScript -- write a factory function!

```js
const AddFloatsNode = ({ a, b }) =>
  ShaderNode({
    in: {
      a: float(a),
      b: float(b)
    },
    out: {
      value: float("in_a + in_b")
    }
  })
```

### Special variables `a` (in) and `value` (out)

### Using Filter Chains

TODO

[shadermaterial]: https://threejs.org/docs/#api/en/materials/ShaderMaterial
[three.js]: https://threejs.org/
