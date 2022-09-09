![Composer Suite](https://user-images.githubusercontent.com/1061/189347136-c81b7807-dbbc-4d8f-a890-b9d6639165b0.jpg)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=for-the-badge)](CODE_OF_CONDUCT.md)

> **Note**
>
> This suite of libraries is primarily targeted at building games with [React](https://reactjs.org/) and [React-Three-Fiber]. Some of these libraries can be used outside of React, just like some others are not specific to Three.js or React-Three-Fiber, but you will find most example code to be written in React.

## Sponsors ❤️

This project wouldn't be possible without the support from its lovely [sponsors](https://github.com/sponsors/hmans). If you'd like to sponsor this project and help make game development with React & Three.js incredible, [click here](https://github.com/sponsors/hmans)!

<!-- sponsors --><a href="https://github.com/kenjinp"><img src="https://github.com/kenjinp.png" width="60px" alt="Kenneth Pirman" /></a><a href="https://github.com/czottmann"><img src="https://github.com/czottmann.png" width="60px" alt="Carlo Zottmann" /></a><a href="https://github.com/verekia"><img src="https://github.com/verekia.png" width="60px" alt="Jonathan Verrecchia" /></a><!-- sponsors -->

## Packages

[![Shader Composer](https://user-images.githubusercontent.com/1061/187867434-1e8bc952-8fed-4e17-afc6-fca97951ba1a.jpg)](https://github.com/hmans/composer-suite/tree/main/packages/shader-composer)  
![react] ![vanilla] ![three]

**[Shader Composer]** takes a graph of nodes (here called "units") and compiles it to a working GLSL shader. It provides a library of ready-to-use shader units, but you can, of course, add your own. Parameterized sub-graphs of your shaders can be implemented as plain JavaScript functions.

```jsx
const ShaderComposerExample = () => {
  const shader = useShader(() =>
    ShaderMaterialMaster({
      color: pipe(
        Vec3(new Color("red")),
        (v) => Mix(v, new Color("white"), NormalizePlusMinusOne(Sin(Time()))),
        (v) => Add(v, Fresnel())
      )
    })
  )

  return (
    <mesh>
      <sphereGeometry />
      <shaderMaterial {...shader} />
    </mesh>
  )
}
```

[![material-composer-thin](https://user-images.githubusercontent.com/1061/187885049-cdbbd4c6-b974-4214-a0de-916d9ee412bb.jpg)](https://github.com/hmans/composer-suite/tree/main/packages/material-composer)  
![react] ![vanilla] ![three]

**[Material Composer]** provides a mechanism to hook into Three.js materials and customize their behavior using a sequence of material modules. Modules are higher-level implementations of Shader-based functionality, and implemented using [Shader Composer]. Material Composer provides a library of these material modules that are easy to extend and customize; but, as always, you can add your own.

```jsx
const MaterialComposerExample = () => (
  <mesh position-y={1.5} castShadow>
    <sphereGeometry />

    <composable.meshStandardMaterial>
      <modules.Color color="#d62828" />

      <Layer opacity={NormalizePlusMinusOne(Sin(Time()))}>
        <modules.Color color="#003049" />
      </Layer>

      <modules.Fresnel intensity={0.2} />
    </composable.meshStandardMaterial>
  </mesh>
)
```

[![VFX Composer](https://user-images.githubusercontent.com/1061/187867928-5cac4fa9-908c-4c78-93de-2a9ac3998dbd.jpg)](https://github.com/hmans/composer-suite/tree/main/packages/vfx-composer)  
![react] ![vanilla] ![three]

_TODO_

[![timeline-composer-thin](https://user-images.githubusercontent.com/1061/187868484-5cd3ebd6-7961-4fd3-aef0-eca22f79417a.jpg)](https://github.com/hmans/composer-suite/tree/main/packages/timeline-composer)  
![react]

**[Timeline Composer]** provides a small, but powerful collection of React components that can be used to orchestrate an animation sequence:

```jsx
<Lifetime seconds={5}>
  <SmokeRing />
  <Fireball />

  <Delay seconds={0.3}>
    <CameraShake decay />
    <Fireball />

    <Delay seconds={0.2}>
      <Rocks />
      <SmokeCloud />
    </Delay>
  </Delay>
</Lifetime>
```

### Render Composer

![react] ![three]

_TODO_

### Input Composer

![react] ![vanilla]

_TODO_

### UI Composer

![react]

_TODO_

### Camera Composer

![react] ![vanilla] ![three]

_TODO_

## Development

### Core Tenets

- **Authored in and for TypeScript**.  
  All libraries are authored in TypeScript, with first-class type support. This means that you can use these libraries in JavaScript, but you will get the best experience when using TypeScript. If you're using them from within JavaScript, please be aware that these libraries will not make any significant effort to provide runtime type checking or similar.
- **Flawless HMR**.  
  The libraries should provide a fun and flawless development experience with the best support for hot-module reloading possible. The user should be able to hot-reload their code and see the changes immediately in the browser. Where possible, state should be retained; there must never be errors when hot-reloading.

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

[react-three-fiber]: https://github.com/pmndrs/react-three-fiber
[shader composer]: https://github.com/hmans/composer-suite/tree/main/packages/shader-composer
[timeline composer]: https://github.com/hmans/composer-suite/tree/main/packages/timeline-composer
[vfx composer]: https://github.com/hmans/composer-suite/tree/main/packages/vfx-composer
[material composer]: https://github.com/hmans/composer-suite/tree/main/packages/material-composer
[react]: https://img.shields.io/badge/-react-blue?style=for-the-badge
[vanilla]: https://img.shields.io/badge/-vanilla-yellow?style=for-the-badge
[three]: https://img.shields.io/badge/-three-brightgreen?style=for-the-badge
