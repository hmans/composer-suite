![Timeline Composer](https://user-images.githubusercontent.com/1061/181918724-c6702e47-71f9-4962-a567-05d1b85f594d.jpg)

[![Version](https://img.shields.io/npm/v/timeline-composer?style=for-the-badge)](https://www.npmjs.com/package/timeline-composer)
[![Downloads](https://img.shields.io/npm/dt/timeline-composer.svg?style=for-the-badge)](https://www.npmjs.com/package/timeline-composer)
[![Bundle Size](https://img.shields.io/bundlephobia/min/timeline-composer?label=bundle%20size&style=for-the-badge)](https://bundlephobia.com/result?p=timeline-composer)

A small collection of React components for declaratively constructing high-level animation timelines with **repetitions**, **delays**, and **auto-removing** elements.

## Example

You can use Timeline Composer in any type of React project. Here's an example where it's used to orchestrate a staggered [VFX Composer](https://github.com/hmans/vfx-composer) animation:

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

## Features

- Compose React component timelines with **repetitions**, **delays**, and **auto-removing elements** from a small set of timing primitives.
- Uses a custom `requestAnimationFrame`-based ticker with **clamped frame deltas** and optional **time scaling**.[^1]
- Compact API surface, tiny footprint, no dependencies.
- Built with TypeScript, because types are nice, and so are you.

[^1]: Time scaling is work in progress.

## Getting started

Simply add the `timeline-composer` package using your favorite package manager.

```
yarn add timeline-composer
npm add timeline-composer
pnpm add timeline-composer
```

## Components

### Delay

Delays rendering its children for the specified amount of time.

```jsx
<Delay seconds={2.5}>
  <p>I will only render after 2.5 seconds!</p>
</Delay>
```

### Repeat

Repeats (unmounts and re-mounts) its children for the specified number of times, with the specified delay between each repetition.

```jsx
<Repeat seconds={2.5} times={3}>
  <p>
    I will automatically unmount and re-mount every 2.5 seconds, and stop after showing 3
    times, because that is clearly enough!
  </p>
</Repeat>
```

The default for `times` is `Infinity`, so it will repeat forever:

```jsx
<Repeat seconds={2.5}>
  <p>I will repeat forever.</p>
  <p>Have a random number: {Math.random()}</p>
</Repeat>
```

### Lifetime

Will render its children immediately, but remove them after the specified time.

```jsx
<Lifetime seconds={2.5}>
  <p>I'm only here for 2.5 seconds. Cya!</p>
</Lifetime>
```

## Examples

### Combining Delay, Repeat, and Lifetime

Things get a little more interesting when you combine these.

```jsx
<Lifetime seconds={10}>
  <Repeat seconds={0.5}>
    <Lifetime seconds={0.25}>
      <p>I miss the blink tag!</p>
    </Lifetime>
  </Repeat>
</Lifetime>
```

### Repeatedly toggling between two states

```jsx
<Repeat seconds={1}>
  <Lifetime seconds={0.5}>
    <p>See</p>
  </Lifetime>

  <Delay seconds={0.5}>
    <p>Saw</p>
  </Delay>
</Repeat>
```

### Waterfall animations

Delays can be nested to create a waterfall of animations.

```jsx
<Delay seconds={1}>
  <p>One...</p>

  <Delay seconds={0.5}>
    <p>Two...</p>

    <Delay seconds={0.5}>
      <p>...three!</p>
    </Delay>
  </Delay>
</Delay>
```

## Development

Timeline Composer uses the PNPM package manager. After cloning the repository, you can get a development environment up and running by running the following commands:

```sh
pnpm install
pnpm dev
```

## Author

Timeline Composer is written and maintained by [Hendrik Mans](https://hmans.co). If you have questions, email me at [hendrik@mans.de](mailto:hendrik@mans.de), or [find me on Twitter](https://twitter.com/hmans).

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
