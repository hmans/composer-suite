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

  /** Human-readable name of this node. */
  name: string

  /** Slug of this node. Automatically generated at compile-time. */
  slug: string

  /** When set, the node will only be rendered in the specified program. */
  only?: "vertex" | "fragment"

  /**
   * When set to true, the value for this node will only be calculated in
   * the vertex shader, and then passed to the fragment shader as a varying;
   * the fragment shader will then source that varying, instead of calculating
   * the value from scratch.
   */
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
> = INode<T> & API & { toString: () => string }

const nextAnonymousId = idGenerator()

/**
 * Create a node for the shader tree.
 *
 * @param type GLSL type of the node.
 * @param value Value of the node. Can be a JS value, a reference to another node, or a string expression.
 * @param configInput Optional configuration object.
 * @returns A freshly created node, just for you
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
    name: "anon",
    slug: identifier("anonymous", id),

    /* User-provided configuration */
    ...configInput
  }

  const v: Node<T> = {
    _: "Node",
    _config: config,
    type,
    value,
    toString: () => config.slug
  }

  return v
}

export function isNode(v: any): v is Node {
  return v && v._ === "Node"
}

/* Helpers */

export const withAPI = <T extends GLSLType, A extends {}>(
  node: Node<T>,
  api: A
) => ({ ...node, ...api } as Node<T, A>)

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
