# /Shádenfreude/, German: the joy of writing shaders

## Introduction

Creating shaders from node graphs is fun -- users of engines like Unity or Unreal Engine do it all the time! Shadenfreude aims at providing a node-based shader composition experience from a code-first perspective, designed for use with [Three.js].

Instead of clicking your way through an editor, saving the generated shader, and hoping it will load correctly into your application, with Shadenfreude, _you just write code_; Shadenfreude makes this as pleasant an experience as possible.

> **EARLY DAYS WARNING! ⚠️**
> This library is very extremely new. I'd love for you to give it a go and maybe provide some feedback, but I would currently recommend **strongly** against using it in any sort of production project, unless you're ready and willing to keep up with the changes every release. **Use at your own risk.**

## Features

- Rapidly create complex [Three.js] shaders using a library of ready-to-use nodes, or add your own!
- Nodes are just plain JavaScript objects, and they can implement anything from tiny pieces of processing, up to big monolithic behemoths of shader code!
- Use all the language tools you already know to wrap individual branches into reusable, distributable components!
- Developed in Typescript, with fantastic type support out of the box!

Shadenfreude also has a couple of non-features:

- It does not provide a full node-based reimplementation of Three.js' built-in materials.
- It does not provide a graphical shader node editing environment, and does not aim to do this in the future, even though such a tool could probably be built on top of it. Shadenfreude's main focus is on providing a great, joyful code-first experience.

## Examples & Sandboxes

- **[The official Shadenfreude sandbox](https://codesandbox.io/s/github/hmans/shadenfreude-sandbox?file=/src/App.js)**. Fork it and go nuts!

## Basic Use

### Hello World

Shadenfreude compiles a working GLSL shader from a tree of JavaScript objects, each implementing a small (or sometimes large) piece of functionality. Compilation always starts with a single root node, also called a "master node"; this library provides a couple of these master nodes for different usage scenarios. Let's start with creating a Three.js [ShaderMaterial] and assigning a simple shader to it:

```jsx
/* Create a shader node */
const root = ShaderMaterialMasterNode({
  color: new THREE.Color("hotpink")
})

/* Compile the shader */
const [shader] = compileShader(root)

/* Create a material and assign the compiled shader */
const material = new THREE.ShaderMaterial(shader)
```

### Variables

Most of the time, nodes have **input and output variables**. You can directly assign JS values to input variables, but you can also connect an output variable to an input of another node.

Building on the previous example, let's use a `MixNode` to mix together two colors:

```jsx
const root = ShaderMaterialMasterNode({
  color: MixNode({
    a: new THREE.Color("hotpink"),
    b: new THREE.Color("green"),
    amount: 0.5
  })
})
```

What's going on here?

- We're directly assigning JS values (in this case, two `Color` instances) to the `a` and `b` inputs of `MixNode`. This will result in these values to be compiled into the final shader as constant values.
- We're connection `MixNode` to `ShaderMaterialMasterNode`'s `color` input.

Okay, ignoring the fact that the resulting color is going to look unfathomably terrible, something very important is going to happen here: the colors will not be mixed on the CPU, but _within the compiled shader_.

### Explicit Variable Assignment

Instead of assigning inputs at time of instantiation, you can also do it imperatively after nodes have been created. The previous example can be rewritten like this:

```jsx
const colorA = new THREE.Color("hotpink")
const colorB = new THREE.Color("green")

const mixedColor = MixNode()
plug(colorA).into(mixedColor) /* uses the "a" variable by default */
plug(colorB).into(mixedColor.inputs.b)
plug(0.5).into(mixedColor.inputs.amount)

const root = ShaderMaterialMasterNode()
plug(mixedColor).into(root.inputs.color)
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
const [shader, update] = compileShader(root)

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
  inputs: {
    a: variable("float", 0),
    b: variable("float", 0)
  },
  outputs: {
    value: variable("float")
  },
  vertex: {
    body: "outputs.value = inputs.a + inputs.b;"
  },
  fragment: {
    body: "outputs.value = inputs.a + inputs.b;"
  }
})
```

Let's go through these from top to bottom and discuss some of the things we're seeing here.

- First of all, note that **the `name` property is entirely optional**. It is, however, _recommended_ that you set it; if the shader compilation ever fails, this will help you tremendously on your hunt for the cause.
- We're **declaring two `input` variables**, `a` and `b`.
- Each of these is declared as `variable("float", 0)`. This is how we tell the compiler that we want them to have the GLSL `float` type, and a default value of `0` if nothing else is assigned to them.
- We're also **declaring an `output` variable** called `value`. Note that it doesn't have a default value.
- Shaders are composed of two programs, the **vertex shader and the fragment shader**, and Shadenfreude allows us to declare code for both. Here, we need to set the output variable, and since the node can be used in both programs, we need to supply the same chunk for both, too.
- Note that within the generated GLSL code, **input and output variables are prefixed** with `inputs.` and `outputs.`, respectively.

This is all a bit verbose, so let's make it a bit leaner:

```js
const node = ShaderNode({
  inputs: {
    a: float(0),
    b: float(0)
  },
  outputs: {
    value: float("inputs.a + inputs.b")
  }
})
```

This version is functionally equivalent to the one before, but we're doing some things differently:

- Note how we're using the `float(v)` variable factory -- it's just a shortcut for `variable("float", v)`.
- Instead of imperatively writing the calculated result value into `outputs.value`, we're providing a string default value in the `value` output variable's declaration. When variables have string values, the string will be used in the generated GLSL verbatim, and we can use this here to our advantage.

### Writing reusable shader nodes

We've been creating standalone shader nodes so far, but what if we want to be able to create multiple instances of the same node? Well, just do what you would normally do in JavaScript -- write a factory function!

```js
const AddFloatsNode = ({ a = 0, b = 0 } = {}) =>
  ShaderNode({
    inputs: {
      a: float(a),
      b: float(b)
    },
    outputs: {
      value: float("inputs.a + inputs.b")
    }
  })
```

Typescript users can use the `Parameter<T>` type for properly typing shader node props:

```ts
type Props = {
  a: Parameter<"float">
  b: Parameter<"float">
}

const AddFloatsNode = ({ a = 0, b = 0 }: Props = {}) =>
  ShaderNode({
    inputs: {
      a: float(a),
      b: float(b)
    },
    outputs: {
      value: float("inputs.a + inputs.b")
    }
  })
```

Since this pattern is so common -- creating a function that takes a props object that just happens to mirror the input variables on the generated shader node -- Shadenfreude also provides the `Factory` helper that will generate one of these factories for you (with proper types, if you're in Typescript):

```ts
const AddFloatsNode = Factory(() => ({
  inputs: {
    a: float(),
    b: float()
  },
  outputs: {
    value: float("inputs.a + inputs.b")
  }
}))

const node = AddFloatsNode({ a: 1, b: 2 })
```

A couple of notes:

- The only argument to `Factory` is a function that returns a shader node definition (note that it doesn't need to use the `ShaderNode` function.)
- `Factory` returns a factory function that takes a props object -- typed according to the `in` variables. When this function is invoked, the props passed into it are assigned to their respective input variables.

### Special variables `inputs.a` and `outputs.value`

Input and output variables can be named anything you want (as long as the name can be part of a GLSL variable identifier), but two variables have special meaning:

- `inputs.a` is considered the _default_ input variable.
- `outputs.value` is considered the _default_ output variable.

We can use this to our advantage anywhere we're assigning values to variables, for example:

```js
plug(colorA).into(mixedColor)
AnimateNode({ time: TimeNode() })

/* This is equivalent to: */
plug(colorA.outputs.value).into(mixedColor.inputs.a)
AnimateNode({ time: TimeNode().outputs.value })
```

### Writing vertex and fragment program code

TODO

### Using Varyings

Varyings are variables that are typically written to in the vertex shader, and then read from in the fragment shader, with their values interpolated across fragments.

Shader nodes can declare varyings through their `varyings` property. Varyings declared here will automatically be added to the shader headers, using a scoped global name to prevent naming conflicts.

We can use varyings to make data that is only availabel in the vertex shader available in the fragment shader, too. For example, here's the implementation of `GeometryPositionNode`, which provides the `position` buffer attribute value. We can only read from attributes in the vertex shader, so we're using a varying to make the data available in the fragment shader, too:

```js
const GeometryPositionNode = Factory(() => ({
  name: "Position",
  varyings: {
    v_position: vec3("position")
  },
  outputs: {
    value: vec3("v_position")
  }
}))
```

A couple of notes, as usual:

- We're declaring a `v_position` varying. The actual varying declaration in the shader will use a name unique to this shader node, in order to prevent name conflicts; but within your node, you can use the `v_position` name to access it.
- We're declaring `v_position` to be of type `vec3`, and are using `position` as its default value. Remember that string values are inserted into the GLSL verbatim -- here we're sourcing the default value from the `position` attribute, which, thanks to Three.js, is already available as a global variable.
- Similarly, we're setting the `value` out variable's value to `v_position`, to source the value from the varying. If we just used `position` here, the shader would break, because `position` is not available in the fragment shader -- but `v_position` is!

### Using Uniforms and Attributes

TODO

### Using Filter Chains

TODO

### Conventions

- If your shader node has a primary input variable, name it `a`.
- If your shader node has a primary output variable, name it `value`.

[shadermaterial]: https://threejs.org/docs/#api/en/materials/ShaderMaterial
[three.js]: https://threejs.org/
[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
