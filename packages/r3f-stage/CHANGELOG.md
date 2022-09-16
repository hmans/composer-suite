# r3f-stage

## 0.3.5

### Patch Changes

- Updated dependencies [2a56a89]
- Updated dependencies [2a56a89]
- Updated dependencies [2a56a89]
  - render-composer@0.2.0

## 0.3.4

### Patch Changes

- 004bd19: Add `three-stdlib` to silence the peer dependency warnings triggered by `r3f-perf`.

## 0.3.3

### Patch Changes

- 6ea2936: The Rendering and Presentation options have been merged into a single Leva panel, which is now collapsed by default.

## 0.3.2

### Patch Changes

- 19a4b64: Relax peerDependencies versions a little.

## 0.3.1

### Patch Changes

- f90dd83: Add `<Heading>`, a component that allows the user to split the list of examples with a heading.

## 0.3.0

### Minor Changes

- b7fb75e: **Breaking Change:** Once more, the way examples are declared has been changed. We now use plain old JSX and some React components for this. Example:

  ```jsx
  const IcosahedronExample = React.lazy(() =>
    import("./examples/IcosahedronExample")
  )

  function App() {
    return (
      <Application>
        <Example path="simple" title="Simple" makeDefault>
          <Description>This is a simple example.</Description>

          <mesh>
            <boxGeometry />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </Example>

        <Example path="complex" title="Complex">
          <Description>
            This is a complex example that is being lazy-loaded, yay!
          </Description>

          <IcosahedronExample />
        </Example>
      </Application>
    )
  }
  ```

- a599b5e: Extracted our implementation of render-composer into a standalone `render-composer` package that we're also now using, yay!

### Patch Changes

- c9f4180: Move Suspense into individual examples
- a0923c6: Use WIP version of tunnel-rat (will switch to package version once the PR is merged.)
- c85ea3e: Desperately and foolishly move dependencies back into dependencies. This has not been a fun day.
- d377c10: Don't set a stage by default. Let the user use plain JSX.

## 0.3.0-next.9

### Minor Changes

- a599b5e: Extracted our implementation of render-composer into a standalong `render-composer` package that we're also now using, yay!

### Patch Changes

- b1f3a3a: Upgrade render-composer

## 0.3.0-next.8

### Patch Changes

- 456e11b: Today was not a good day.

## 0.3.0-next.7

### Patch Changes

- c85ea3e: Desperately and foolishly move dependencies back into dependencies. This has not been a fun day.

## 0.3.0-next.6

### Patch Changes

- ef34b65: Move leva and r3f-perf back into deps

## 0.3.0-next.5

### Patch Changes

- a0923c6: Use WIP version of tunnel-rat (will switch to package version once the PR is merged.)

## 0.3.0-next.4

### Patch Changes

- d377c10: Don't set a stage by default. Let the user use plain JSX.

## 0.3.0-next.3

### Patch Changes

- c9f4180: Move Suspense into individual examples

## 0.3.0-next.2

### Minor Changes

- 70fe69d: I have no idea what I'm doing.
- 9c4fa15: Playing with peerDeps is fun!

## 0.3.0-next.1

### Minor Changes

- b935faf: **Breaking Change:** move the most important dependencies (three, etc.) back into peer dependencies.

## 0.3.0-next.0

### Minor Changes

- b7fb75e: **Breaking Change:** Once more, the way examples are declared has been changed. We now use plain old JSX and some React components for this. Example:

  ```jsx
  const IcosahedronExample = React.lazy(() =>
    import("./examples/IcosahedronExample")
  )

  function App() {
    return (
      <Application>
        <Example path="simple" title="Simple" makeDefault>
          <Description>This is a simple example.</Description>

          <mesh>
            <boxGeometry />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </Example>

        <Example path="complex" title="Complex">
          <Description>
            This is a complex example that is being lazy-loaded, yay!
          </Description>

          <IcosahedronExample />
        </Example>
      </Application>
    )
  }
  ```

## 0.2.6

### Patch Changes

- fca82cd: Move peer dependencies into dependencies to simplify usage.

## 0.2.5

### Patch Changes

- 0a357ed: Increase maximum distance of OrbitControls to 30.

## 0.2.4

### Patch Changes

- 9649aeb: Fix redirect on reload.

## 0.2.3

### Patch Changes

- b5a3fd3: Fixed Leva sizing issues.

## 0.2.2

### Patch Changes

- 867045d: Export `Layers` and `useRenderPipeline`.

## 0.2.1

### Patch Changes

- d54b840: Fixed a faulty import in `FlatStage`.

## 0.2.0

### Minor Changes

- 19fc8b3: Complete rework of the library, with the new code extracted from the shader-composer project.
