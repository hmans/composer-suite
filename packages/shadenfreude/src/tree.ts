import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { Expression } from "./expressions"
import { identifier, Part } from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"

/**
 * The different GLSL types we're supporting in nodes.
 */
export type GLSLType =
  | "bool"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"

export type JSTypes = {
  bool: boolean
  float: number
  vec2: Vector2
  vec3: Vector3 | Color
  vec4: Vector4
  mat3: Matrix3
  mat4: Matrix4
}

export type Value<T extends GLSLType = any> = Expression | JSTypes[T] | Node<T>

export type Chunk = Part | Part[]

export type NodeConfig<T extends GLSLType = any> = {
  id: number
  title: string
  name: string
  only?: "vertex" | "fragment"
  varying?: boolean
  vertexHeader?: Chunk
  vertexBody?: Chunk
  fragmentHeader?: Chunk
  fragmentBody?: Chunk
}

/**
 * Any object that extends the INode type can be a node in the shader tree.
 * Node objects are free to expose any additional properties on top of this.
 */
export interface INode<T extends GLSLType = any> {
  _: "Node"
  _config: NodeConfig<T>
  type: T
  value: Value<T>
}

export type Node<
  T extends GLSLType = any,
  API extends Record<string, any> = {}
> = INode<T> & API

const nextAnonymousId = idGenerator()

/**
 * Create a variable. Variables are the nodes the shader tree is composed of. Everything in the tree
 * is expressed as a variable.
 *
 * @param type GLSL type of the variable.
 * @param value Value of the variable. Can be a JS value, a reference to another variable, or a string expression.
 * @param configInput Optional configuration object.
 * @returns A freshly created variable, just for you
 */
export const Node = <T extends GLSLType>(
  type: T,
  value: Value<T>,
  configInput: Partial<NodeConfig<T>> = {}
) => {
  const id = nextAnonymousId()

  const config: NodeConfig<T> = {
    /* Defaults */
    id,
    title: "anon",
    name: identifier("anonymous", id),

    /* User-provided configuration */
    ...configInput
  }

  const v: Node<T> = {
    _: "Node",
    _config: config,
    type,
    value
  }

  return v
}

export function isNode(v: any): v is Node {
  return v && v._ === "Node"
}

/* Helpers */

const makeNodeHelper = <T extends GLSLType>(type: T) => (
  v: Value<T>,
  extras?: Partial<NodeConfig<T>>
) => Node(type, v, extras)

export const Float = makeNodeHelper("float")
export const Bool = makeNodeHelper("bool")
export const Vec2 = makeNodeHelper("vec2")
export const Vec3 = makeNodeHelper("vec3")
export const Vec4 = makeNodeHelper("vec4")
export const Mat3 = makeNodeHelper("mat3")
export const Mat4 = makeNodeHelper("mat4")
