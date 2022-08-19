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

VFX Composer (formerly known as three-vfx, or 3VFX) is a visual effects library for [Three.js](https://threejs.org/) and [react-three-fiber](https://github.com/pmndrs/react-three-fiber) (through the [vfx-composer-r3f](https://github.com/hmans/vfx-composer/tree/main/packages/vfx-composer-r3f) package.) It allows you to build complex visual effects in a declarative way, compiling them into shaders using the [Shader Composer](https://github.com/hmans/shader-composer) library.

## Examples & Demos 🎓

- **[Official Examples Suite](https://three-vfx-examples.vercel.app/)**
- **[Official Starter Sandbox](https://codesandbox.io/s/github/hmans/three-vfx-starter?file=/src/Effect.js)** (fork it!)
- [Space Nebulae](https://codesandbox.io/s/vfx-space-just-the-nebulae-xv9bqm?file=/src/App.js)

## How this Library Works 🥳

## Hacking & Development 🏗

Clone this repository and run:

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
