import { Add, Div, Mix, Mul, Sub } from "@shader-composer/core"
import { GLSLType, Input } from "@shader-composer/core"

export const mix =
  <T extends GLSLType>(b: Input<T>, f: Input<"float">) =>
  (a: Input<T>) =>
    Mix(a, b, f)

export const add =
  <B extends GLSLType>(b: Input<B>) =>
  <A extends GLSLType>(a: Input<A>) =>
    Add(a, b)

export const sub =
  <B extends GLSLType>(b: Input<B>) =>
  <A extends GLSLType>(a: Input<A>) =>
    Sub(a, b)

export const mul =
  <B extends GLSLType>(b: Input<B>) =>
  <A extends GLSLType>(a: Input<A>) =>
    Mul(a, b)

export const div =
  <B extends GLSLType>(b: Input<B>) =>
  <A extends GLSLType>(a: Input<A>) =>
    Div(a, b)
