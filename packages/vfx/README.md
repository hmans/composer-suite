![vfx Logo](https://user-images.githubusercontent.com/1061/172030500-4142969b-a0be-403b-94a1-a6d23e20cfa3.png)

> **Warning**
> This library is (extremely!) work-in-progress. **Use at your own risk.**

## Introduction

`vfx` is a visual effects library for [react-three-fiber](https://github.com/pmndrs/react-three-fiber). It aims to be highly performant (with effects almost entirely simulated on the GPU) and easy to extend.

## Usage

Please do not use this in your own projects yet, as both API and functionality is still going to change _significantly_. But if you want to give the thing a whirl anyway, clone this repository and run:

```
yarn && yarn examples
```

## Features

- [x] **Support for mesh particles**. Every effect makes use of intanced meshes. No matter how many particles you spawn, they're always going to be just 1 draw call (per effect.)
- [x] **Declarative emitters.** Just add `<Emitter>` to your JSX.

### Missing

- [ ] **Support for point or sprite particles.** Yes, it can be done, but probably not lit (ie. taking scene lights into account), which makes them significantly less interesting for visual effects. (PRs welcome!)
- [ ] **Emitters as scene objects.** Emitters will eventually be scene objects with their own transforms. That way, you can animate particle spawning positions by moving them through your scene.
- [ ] **Soft Particles**. PRs welcome! (#1)
