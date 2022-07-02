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

TODO

[shadermaterial]: https://threejs.org/docs/#api/en/materials/ShaderMaterial
[three.js]: https://threejs.org/
