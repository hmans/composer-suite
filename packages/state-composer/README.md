# State Composer

## Summary

State Composer is a library for **managing state in games built with React**. It is in its early stages of development and currently only provides mechanisms for modeling finite state machines.

## Features

- Simple, reactive **Finite State Machines**.
- Authored in Typescript, **for use in TypeScript**. Favors compile-time type safety over runtime checks.

## State Machines

State Composer provides the `createStateMachine` function for creating state machines. It will return a collection of functions and components that allow you to interact with your state machine.

These functions and components are fully typed, and you are expected to provide the possible states for your state machine when you create it. **There is no runtime checking for allowed states**.

Just like with most other stores, it is recommended that you create these state machines outside of components, and ideally in a separate, central module that makes the state machines available to the entire project, or a section of it.

For example, your game may have a `state.ts` module that creates and exports all the different pieces of state that your game uses, including state machines created using this library:

```ts
/* Define a type of possible states */
type State = "menu" | "gameplay" | "pause" | "gameover"

/* Create and export the State Machine */
export const GameState = createStateMachine<State>("menu")
```

Now this state machine can be imported and used in other module of your project.

### Checking the Current State

`createStateMachine` returns a `Match` component that can now be used to only render a tree of React children when the current state equals a specified state, or is in a list of specified states:

```tsx
import { GameState } from "./state"

const Game = () => (
  <Canvas>
    <GameState.Match state="menu">
      <Menu />
    </GameState.Match>

    {/* The gameplay tree is rendered no matter if the game is paused or not */}
    <GameState.Match state={["gameplay", "pause"]}>
      <Gameplay />
    </GameState.Match>

    <GameState.Match state="pause">
      <Menu />
    </GameState.Match>

    <GameState.Match state="pause">
      <Menu />
    </GameState.Match>
  </Canvas>
)
```

If you need to check the current state from within imperative code, you can use the `is` function:

```ts
if (GameState.is("gameplay")) {
  /* ... */
}
```

### Transitioning Between States

State machines provide an `enter` function that can be used to move from the current to a new state, but unlike other FSM implementations, State Composer does _not_ provide any extra mechanisms for defining transitions or guards, and instead asks you to implement these as simple functions.

Things you'll typically do related to state transitions:

- Check if the state machine is currently in a specific state
- Check if some other condition is true
- Execute some code that should run at the transition
- Make the state machine enter a new state

All of these can be done using normal JavaScript, and the functions provided by `createStateMachine`. For example, a function that transitions from the `menu` to the `gameplay` state may look like this:

```ts
export const enterGameplay = () => {
  /* Check if we're currently in an expected state */
  if (!GameState.is("menu")) return

  /* Execute some code that should run at the transition */
  initializeGameplay()

  /* Transition to the next state */
  GameState.enter("gameplay")
}
```

If that's a little too verbose and/or imperative for you, consider that you can also chain functions together using logical operators:

```ts
export const returnToTitle = () =>
  GameState.is("gameplay") && GameState.enter("title")
```

If you ever need guard functions that check specific conditions before transitioning to a new state, consider implementing them as functions returning a boolean value, and using them as part of these logic chains:

```ts
const canStartGame = () => {
  /* Something that returns true or false */
}

export const startGame = () =>
  GameState.is("menu") && canStartGame && GameState.enter("title")
```

> **Note**
> You can define these functions in the same `state.ts` module where you create the state machine, or in a separate module; it doesn't really matter.

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
