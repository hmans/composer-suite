![VFX Composer](https://user-images.githubusercontent.com/1061/181590577-6a51b542-eb11-429e-9fae-35ecc949d0df.jpg)

[![Version](https://img.shields.io/npm/v/vfx-composer?style=for-the-badge)](https://www.npmjs.com/package/vfx-composer)
[![Downloads](https://img.shields.io/npm/dt/vfx-composer.svg?style=for-the-badge)](https://www.npmjs.com/package/vfx-composer)
[![Bundle Size](https://img.shields.io/bundlephobia/min/vfx-composer?label=bundle%20size&style=for-the-badge)](https://bundlephobia.com/result?p=vfx-composer)

> **Warning**
>
> This library is (extremely!) work-in-progress; meaning that **it is not done**, or ready for use in any other capacity. Please don't use this and assume that anything will work; it probably won't. And when you find something that does work, be ready for it to break in the next release. **Please don't open Issues or PRs for things that are broken**; I am most likely aware of them. **Use this library at your own risk.**
>
> If you're interested in using this library and want to keep up to date, please [follow me on Twitter](https://twitter.com/hmans), and/or click the Watch button for this repository.

## Introduction 👋

VFX Composer (formerly known as three-vfx, or 3VFX) is a visual effects library for [Three.js](https://threejs.org/) and [react-three-fiber](https://github.com/pmndrs/react-three-fiber). It aims to be highly performant (with effects almost entirely simulated on the GPU) and easy to extend.

## Status ⚠️

This library is currently under heavy development, and is most definitely **not ready for any sort of production use whatsoever**. If you're interested in giving it a try, you are, however, invited to play with any of the example sandboxes listed below!

## Examples & Demos 🎓

- **[Official Examples Suite](https://three-vfx-examples.vercel.app/)**
- **[Official Starter Sandbox](https://codesandbox.io/s/github/hmans/three-vfx-starter?file=/src/Effect.js)** (fork it!)
- [Space Nebulae](https://codesandbox.io/s/vfx-space-just-the-nebulae-xv9bqm?file=/src/App.js)

## Where is the Documentation?

I'm afraid there's currently **no documentation available** outside of the sandboxes linked to above. As much as I would like to provide documentation, the library is still too much in flux, with breaking changes landing on `main` on almost a daily basis. There _will_ be extensiv documentation as soon as things start to settle down -- until then, if you want to play around with the library, please feel free to use/fork one of the available sandboxes.

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

## Resources

A couple of links to (possibly free) resources that will help you build cool visual effects.

- [Kenney's Particle Pack](https://www.kenney.nl/assets/particle-pack)
- [Kenney's Smoke Particles](https://www.kenney.nl/assets/smoke-particles)
- [Unity's Free VFX Flipbooks](https://blog.unity.com/technology/free-vfx-image-sequences-flipbooks)

## Questions? 💬

Find me on [Twitter](https://twitter.com/hmans) or the [Poimandres Discord](https://discord.gg/aAYjm2p7c7).

## License

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
