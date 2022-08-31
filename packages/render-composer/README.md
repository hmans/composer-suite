# Render Composer

A pre-configured render pipeline for your react-three-fiber games. It is meant to provide some sane defaults for rendering your game, making it easy to make it look fancy, but also providing some tooling like a pre-render pass providing render and depth textures to shaders that need them.

## tl;dr

```tsx
function App() {
  return (
    <RenderCanvas>
      <RenderPipeline vignette bloom antiAliasing>
        {/* Just do normal R3F stuff inside. */}
        <directionalLight position={[30, 10, 10]} intensity={1.5} />
        <mesh>
          <icosahedronGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RenderPipeline>
    </RenderCanvas>
  )
}
```

## Customizing RenderCanvas

`<RenderCanvas>` is just a wrapper around react-three-fiber's `<Canvas>` that applies some configuration that Render Composer needs to operate as expected. You can override any of the props if you want to:

```tsx
function App() {
  return (
    <RenderCanvas frameloop="demand">
      <RenderPipeline vignette bloom antiAliasing>
        {/* etc. */}
      </RenderPipeline>
    </RenderCanvas>
  )
}
```

Alternatively, you may use your own `<Canvas>`; but if you do this, please make sure it sets the `flat` property:

```tsx
function App() {
  return (
    <Canvas flat>
      <RenderPipeline vignette bloom antiAliasing>
        {/* etc. */}
      </RenderPipeline>
    </Canvas>
  )
}
```

## Render Passes

TODO

## Roadmap

- [x] A `RenderPipeline` component that implements a basic render pipeline using `postprocessing` and provides its data through a context.
- [x] A `useRenderPipeline` hook that accessess the render pipeline's context.
- [x] Implement a pre-render pass and make both the render and depth textures available through context.
- [x] Provide a bunch of preconfigured post-processing effects and make them toggleable through props.
- [x] Make the different post-processing effects configurable beyond just being able to turn them on and off. (eg. allow the user to provide the individual effect's instantiation arguments as a prop.)
- [ ] Allow the user to configure their own post-processing effects.
