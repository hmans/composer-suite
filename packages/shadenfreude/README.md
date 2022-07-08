# /Shádenfreude/, German: the joy of writing shaders

## Introduction

Creating shaders from node graphs is fun -- users of engines like Unity or Unreal Engine do it all the time! Shadenfreude aims at **providing a node-based shader composition experience from a code-first perspective**, designed for use with [Three.js].

If you've always liked the idea of composing shaders from node graphs, but secretly preferred doing it through code, then I am happy to admit that you are just like me, and that I have created Shadenfreude for people like us. Let's go! 🚀

> **Warning**
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
> OMG

[shadermaterial]: https://threejs.org/docs/#api/en/materials/ShaderMaterial
[three.js]: https://threejs.org/
[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
