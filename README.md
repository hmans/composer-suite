# Composer Suite

## Summary

You've reacheded the **Composer Suite Monorepo**, home of [Shader Composer], [Material Composer], [VFX Composer] and more! Please things a little time to settle, and stay tuned!

> **Note**  
> This suite of libraries is primarily targeted at building games with React and React-Three-Fiber. Some of these libraries can be used outside of React, just like some others are not specific to Three.js or React-Three-Fiber, but you will find most example code to be written in React.

## Packages

### Shader Composer

![vanilla](https://img.shields.io/badge/-vanilla-yellow) ![react](https://img.shields.io/badge/-react-blue)

**[Shader Composer]** takes a graph of nodes (here called "units") and compiles it to a working GLSL shader. It provides a library of ready-to-use shader units, but you can, of course, add your own. Parameterized sub-graphs of your shaders can be implemented as plain JavaScript functions.

### Material Composer

![vanilla](https://img.shields.io/badge/-vanilla-yellow) ![react](https://img.shields.io/badge/-react-blue)

**[Material Composer]** provides a mechanism to describe Three.js materials as a series of modules that get applied in sequence. Modules are higher-level implementations of Shader-based functionality, and built using [Shader Composer]. Material Composer provides a library of ready-to-use material modules that are easy to extend and customize, and you can, of course, add your own.

### VFX Composer

![vanilla](https://img.shields.io/badge/-vanilla-yellow) ![react](https://img.shields.io/badge/-react-blue)

_TODO_

### Timeline Composer

![react](https://img.shields.io/badge/-react-blue)

_TODO_

### Render Composer

![react](https://img.shields.io/badge/-react-blue)

_TODO_

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

[shader composer]: https://github.com/hmans/composer-suite/tree/main/packages/shader-composer
[vfx composer]: https://github.com/hmans/composer-suite/tree/main/packages/vfx-composer
[material composer]: https://github.com/hmans/composer-suite/tree/main/packages/material-composer
