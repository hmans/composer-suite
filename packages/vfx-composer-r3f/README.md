# vfx-composer-r3f

## Emitters

This library provides an `<Emitter>` component that, attached to an instance of `<Particles>`, will trigger particles to be emitted. It can be configured to do this at a specific rate, and optionally to a specific number of total particles emitted. It can also accept a callback function that will be invoked once per emitted particle, and can be used to configure the particle's initial state.

The default configuration will emit 10 particles per second, with no limit:

```jsx
<Emitter />
```

You can configure it to emit particles at a specific `rate` (in particles per second):

```jsx
<Emitter rate={20} />
```

You can `limit` the total number of particles emitted (the default being `Infinity`):

```jsx
<Emitter limit={100} />
```

You can obviously combine the two:

```jsx
<Emitter rate={20} limit={100} />
```

You can set `rate` to `Infinity` to immediately emit all particles at once:

```jsx
<Emitter rate={Infinity} limit={1000} />
```

> **Warning**
>
> You can not set both `limit` and `rate` to `Infinity`. This will result in an error.

### Configuring Particles

_TODO_

### Emitters are Scene Objects!

Emitters created through `<Emitter>` are actual scene objects in your Three.js scene, meaning that you can animate them just like you would animate any other scene object, or parent them to other objects, and so on. Newly spawned particles will inherit the emitter's position, rotation, and scale.

### Multiple Emitters

Nothing is stopping you from having more than one emitter! If you have multiple emitters, thay can even have completely different configurations (including different setup callbacks.)

All particles spawned will be part of the `<Particles>` instance the emitters use, so plan their particles capacity accordingly.

### Connecting Emitters to Particles Meshes

By default, `<Emitter>` will use React Context to find the nearest `<Particles>` component in the tree, and emit particles from that. This is convenient, but it can be a bit limiting. You may explicitly connect an emitter to a specific particles mesh through the `particles` prop:

```jsx
<Emitter particles={particlesRef} />
```

Now the emitter may live outside of the Particles mesh it is connected to, and will still emit particles from it.
