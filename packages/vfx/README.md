![vfx Logo](https://user-images.githubusercontent.com/1061/172030500-4142969b-a0be-403b-94a1-a6d23e20cfa3.png)

[![Version](https://img.shields.io/npm/v/vfx?style=for-the-badge)](https://www.npmjs.com/package/vfx)
[![Downloads](https://img.shields.io/npm/dt/vfx.svg?style=for-the-badge)](https://www.npmjs.com/package/vfx)
[![Bundle Size](https://img.shields.io/bundlephobia/min/vfx?label=bundle%20size&style=for-the-badge)](https://bundlephobia.com/result?p=vfx)

> **Warning**
> This library is (extremely!) work-in-progress. **Use at your own risk.**

## Introduction 👋

`three-vfx` is a visual effects library for [Three.js](https://threejs.org/) and [react-three-fiber](https://github.com/pmndrs/react-three-fiber). It aims to be highly performant (with effects almost entirely simulated on the GPU) and easy to extend.

## Status ⚠️

This library is currently under heavy development, and is most definitely **not ready for any sort of production use whatsoever**. If you're interested in giving it a try, you are, however, invited to play with any of the example sandboxes listed below!

## Help Wanted! 🙏

If you're into visual effects and/or WebGL/Three.js development, **this library could benefit from your help**. There are a couple of issues and missing features that could use the help (or input) of people much more familiar with these domains than I am -- please [refer to the Roadmap](https://github.com/hmans/three-vfx/issues/4) for details.

## Examples & Demos 🎓

- **[Official Examples Suite](https://vfx-examples.vercel.app/)**
- **[Official Starter Sandbox](https://codesandbox.io/s/github/hmans/three-vfx-starter?file=/src/Effect.js)** (fork it!)
- [Space Nebulae](https://codesandbox.io/s/vfx-space-just-the-nebulae-xv9bqm?file=/src/App.js)

## How this Library Works 🥳

This library aims to be a game-ready library for realtime visual effects in react-three-fiber projects.

It has a focus on performance, while still striving to keep the codebase maintainable and easy to reason about. For this reason, there are certain advanced techniques for particle simulations in WebGL2 that it deliberately chooses _not_ to do, including keeping per-particle state in Frame Buffer Objects; this is why certain features, like particle collisions, are currently not possible.

However, it will happily power _most_ of your game VFX, and it will be _very_ fast doing so!

So, a quick list of things you should know about this library:

- All effects are **particle based**, using **mesh instancing** to render any mesh you throw at them. This allows you to have both simple and complex particles, and have them integrated with your scene's lighting, including shadows. (Support for gl.POINTS particles may be added in the future.)
- Since we're using mesh instancing, **each effect uses a single draw call**, no matter how many particles it is composed of.
- Effects scale from a couple of particles to several hundreds of thousands, or even more. (But for realtime VFX, you rarely need that many.)
- All particles are **fully animated on the GPU**, through some custom shader code. Your CPU is not concerned with the animations in any manner and will be free to do other stuff.
- Particle spawning is controlled from your code, though. Spawning new particles is the only thing where the CPU gets involved. Newly spawned particles are configured by writing values into buffer attributes; **only the parts of these buffers that represent newly spawned particles are uploaded to the GPU** that frame.
- You can currently animate velocity, acceleration, scale, color and opacity per particle. At the moment, these are hard-coded in the library's custom shader code, and attributes like color or scale that change over time only animate through linear interpolation (ie. they linearly mutate from a start value to an end value), but there are plans to make these shaders (and the buffers that configure them) composable through code, which will also allow the selection of different easing functions and animation curves.

## Hacking & Development 🏗

But if you want to give the thing a whirl and do some hacking on it, clone this repository and run:

```
yarn && yarn examples
```

Alternatively, you can [launch the examples app on StackBlitz](https://stackblitz.com/github/hmans/three-vfx), or just [view them on Vercel](https://vfx-examples.vercel.app/).

## Questions? 💬

Find me on [Twitter](https://twitter.com/hmans) or the [Poimandres Discord](https://discord.gg/aAYjm2p7c7).
