# R3F Stage

A pre-configured react-three-fiber environment for demos and examples.

## Features

- A fully pre-configured react-three-fiber environment for demos and examples, with camera, lights, environment, orbit controls, postprocessing and performance monitoring already set up for you.
- If you have multiple examples, it'll provide a navigation UI and a loading indicator while resources are being loaded (including lazy-loaded components.)
- Allows the user to control the current resolution of the renderer, and toggle post-processing effects on and off.
- Comes with [Leva](https://github.com/pmndrs/leva) for easy user controls.
- No tracking, analytics, or other externally loaded dependencies.

## What does it look like?

[![image](https://user-images.githubusercontent.com/1061/185150441-7532e841-673d-47da-9af2-588469eba818.png)](https://r3f-stage.vercel.app/)

## Usage

### CodeSandbox Quickstart

You may use [this CodeSandbox](https://codesandbox.io/s/r3f-stage-fvqlkd?file=/src/App.tsx) to get started.

### Installing the Library

In your freshly created Vite/CRA React app:

```sh
# Mandatory
yarn install r3f-stage

# Types (optional, but very useful)
yarn install -D @types/three
```

### Hello World

Now you can import `Application` from `r3f-stage` and use it to quickly whip up a fully-working Three.js app. Just place the usual react-three-fiber things into the component's children:

```tsx
import { Application } from "r3f-stage"

/* r3f-stage provides a global stylesheet. Please import it in your application and remove any other global styles you may have defined. */
import "r3f-stage/styles.css"

function App() {
  return (
    <Application>
      <mesh>
        <dodecahedronGeometry />
        <meshStandardMaterial />
      </mesh>
    </Application>
  )
}
```

### Description

R3F Stage provides a `Description` component you can use to render a description of your example at the bottom of the viewport:

```tsx
function App() {
  return (
    <Application>
      <mesh>
        <dodecahedronGeometry />
        <meshStandardMaterial />
      </mesh>

      <Description>
        This is a really simple example. Let's move on to more interesting
        things!
      </Description>
    </Application>
  )
}
```

### Multiple Examples

You can use R3F Stage for a simple demo, as described above, but it also allows you to provide multiple examples, and will automatically generate a navigation UI for you.

```tsx
function App() {
  return (
    <Application>
      <Example path="one" title="Example 1" makeDefault>
        <Description>This is a very simple example.</Description>

        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
      </Example>

      <Example path="two" title="Example 2: The Exampling">
        <Description>This is also a very simple example.</Description>

        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="white" />
        </mesh>
      </Example>
    </Application>
  )
}
```

> **Note**
> Take note of the `makeDefault` prop of the first example. This will configure the applicationn to redirect requests to the root path to this example.

### Lazy-loading Examples

Inside examples, you can use all of the tools React provides to you; including using the `React.lazy` helper to lazy-load components the first time they're rendered. While these components and their resources are being loaded, R3F Stage will display an animated loading indicator.

```tsx
const HugeExample = lazy(() => import("./HugeExample"))

function App() {
  return (
    <Application>
      <Example path="huge" title="Huge Example">
        <Description>
          This is an example that uses a lot of resources and uses a long time
          to load, which is why we're loading it lazily.
        </Description>

        <HugeExample />
      </Example>

      {/* ... */}
    </Application>
  )
}
```

### Headings

To give your examples some extra structure, you may use the `<Heading>` component to insert headings into the example navigation:

```tsx
function App() {
  return (
    <Application>
      <Heading>Main Examples</Heading>
      <Example />
      <Example />

      <Heading>Extra Examples</Heading>
      <Example />
      <Example />
      <Example />
    </Application>
  )
}
```

### Stages

_TODO_

## LICENSE

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
