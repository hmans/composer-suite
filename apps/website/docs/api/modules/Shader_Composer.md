---
id: "Shader_Composer"
title: "Module: Shader Composer"
sidebar_label: "Shader Composer"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [IUnit](../interfaces/Shader_Composer.IUnit.md)

## Type Aliases

### API

Ƭ **API**: `Record`<`string`, `any`\>

#### Defined in

[shader-composer/src/units.ts:245](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L245)

___

### APIFactory

Ƭ **APIFactory**<`U`, `A`\>: (`unit`: `U`) => `A`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`IUnit`](../interfaces/Shader_Composer.IUnit.md) |
| `A` | extends [`API`](Shader_Composer.md#api) |

#### Type declaration

▸ (`unit`): `A`

##### Parameters

| Name | Type |
| :------ | :------ |
| `unit` | `U` |

##### Returns

`A`

#### Defined in

[shader-composer/src/units.ts:246](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L246)

___

### CustomShaderMaterialMasterProps

Ƭ **CustomShaderMaterialMasterProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alpha?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `diffuseColor?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `emissiveColor?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `fragColor?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `metalness?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `normal?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `position?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `roughness?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Defined in

[shader-composer/src/stdlib/masters.ts:34](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/masters.ts#L34)

___

### Expression

Ƭ **Expression**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_` | ``"Expression"`` |
| `render` | () => `string` |
| `toString` | () => `string` |
| `values` | `any`[] |

#### Defined in

[shader-composer/src/expressions.ts:5](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/expressions.ts#L5)

___

### FresnelProps

Ƭ **FresnelProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alpha?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `bias?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `factor?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `intensity?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `normal?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `power?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Defined in

[shader-composer/src/stdlib/artistic.ts:8](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/artistic.ts#L8)

___

### GLSLType

Ƭ **GLSLType**: ``"bool"`` \| ``"int"`` \| ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` \| ``"mat3"`` \| ``"mat4"`` \| ``"sampler2D"``

Currently supported GLSLTypes. Probably incomplete!

#### Defined in

[shader-composer/src/units.ts:21](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L21)

___

### GradientStop

Ƭ **GradientStop**<`T`\>: [[`Input`](Shader_Composer.md#input)<`T`\>, [`Input`](Shader_Composer.md#input)<``"float"``\>]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) = ``"vec3"`` |

#### Defined in

[shader-composer/src/stdlib/artistic.ts:40](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/artistic.ts#L40)

___

### GradientStops

Ƭ **GradientStops**<`T`\>: [`GradientStop`](Shader_Composer.md#gradientstop)<`T`\>[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) = ``"vec3"`` |

#### Defined in

[shader-composer/src/stdlib/artistic.ts:38](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/artistic.ts#L38)

___

### Input

Ƭ **Input**<`T`\>: [`Expression`](Shader_Composer.md#expression) \| [`JSTypes`](Shader_Composer.md#jstypes)[`T`] \| [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) = `any` |

#### Defined in

[shader-composer/src/units.ts:44](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L44)

___

### Item

Ƭ **Item**: [`Input`](Shader_Composer.md#input) \| [`Snippet`](Shader_Composer.md#snippet-1) \| [`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/tree.ts:5](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/tree.ts#L5)

___

### JSTypes

Ƭ **JSTypes**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bool` | `boolean` |
| `float` | `number` |
| `int` | `number` |
| `mat3` | `Matrix3` |
| `mat4` | `Matrix4` |
| `sampler2D` | `Texture` |
| `vec2` | `Vector2` |
| `vec3` | `Vector3` \| `Color` |
| `vec4` | `Vector4` |

#### Defined in

[shader-composer/src/units.ts:32](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L32)

___

### Program

Ƭ **Program**: ``"vertex"`` \| ``"fragment"``

#### Defined in

[shader-composer/src/units.ts:16](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L16)

___

### ShaderMaterialMasterProps

Ƭ **ShaderMaterialMasterProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `alpha?` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `color?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `position?` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Defined in

[shader-composer/src/stdlib/masters.ts:7](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/masters.ts#L7)

___

### Snippet

Ƭ **Snippet**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_` | ``"Snippet"`` |
| `expression` | [`Expression`](Shader_Composer.md#expression) |
| `name` | `string` |
| `render` | (`name`: `string`) => [`Expression`](Shader_Composer.md#expression) |

#### Defined in

[shader-composer/src/snippets.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/snippets.ts#L3)

[shader-composer/src/snippets.ts:10](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/snippets.ts#L10)

___

### UniformUnit

Ƭ **UniformUnit**<`T`, `J`\>: [`Unit`](Shader_Composer.md#unit-1)<`T`\> & { `value`: `J`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `J` | extends [`JSTypes`](Shader_Composer.md#jstypes)[`T`] = [`JSTypes`](Shader_Composer.md#jstypes)[`T`] |

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:14](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L14)

[shader-composer/src/stdlib/uniforms.ts:21](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L21)

___

### Unit

Ƭ **Unit**<`T`\>: [`IUnit`](../interfaces/Shader_Composer.IUnit.md)<`T`\> & [`UnitAPI`](Shader_Composer.md#unitapi)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) = [`GLSLType`](Shader_Composer.md#glsltype) |

#### Defined in

[shader-composer/src/units.ts:199](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L199)

[shader-composer/src/units.ts:201](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L201)

___

### UnitAPI

Ƭ **UnitAPI**<`T`\>: `T` extends ``"vec2"`` ? { `x`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `y`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>  } : `T` extends ``"vec3"`` ? { `x`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `y`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `z`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>  } : `T` extends ``"vec4"`` ? { `w`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `x`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `y`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `z`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>  } : [`API`](Shader_Composer.md#api)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Defined in

[shader-composer/src/units.ts:127](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L127)

___

### UnitConfig

Ƭ **UnitConfig**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `dispose?` | () => `void` | A callback that will be executed when the shader is being disposed. |
| `fragment?` | { `body?`: [`Expression`](Shader_Composer.md#expression) ; `header?`: [`Expression`](Shader_Composer.md#expression)  } | - |
| `fragment.body?` | [`Expression`](Shader_Composer.md#expression) | - |
| `fragment.header?` | [`Expression`](Shader_Composer.md#expression) | - |
| `name` | `string` | Human-readable name of this unit. |
| `only?` | [`Program`](Shader_Composer.md#program) | If this is set to "vertex" or "fragment", the compiler will only ever render this node in the specified program. If you have units referencing gl_* variables that only exist in one of the programs, use this to make sure they never appear in the other program (which would lead to compilation failure.) |
| `type` | `T` | The GLSL type of this unit. |
| `uniform?` | { `value`: [`JSTypes`](Shader_Composer.md#jstypes)[`T`]  } | An optional uniform object. It will automatically be declared in the program headers, and also made available in the object returned by `compilerShader`. |
| `uniform.value` | [`JSTypes`](Shader_Composer.md#jstypes)[`T`] | - |
| `uniformName?` | `string` | - |
| `update?` | [`UpdateCallback`](Shader_Composer.md#updatecallback) | A callback that will be executed once per frame. |
| `value` | [`Input`](Shader_Composer.md#input)<`T`\> \| `undefined` | The value of this unit. Can be a reference to another unit, a JavaScript type that matches this unit's GLSL type, or an Expression. |
| `variableName` | `string` | Machine-readable name of the global variable for this unit. Will be recreated by the compiler, so no need to set this yourself. |
| `varying` | `boolean` | When set to true, this variable will automatically declare a varying, calculate/source its value in the vertex program only, and pass the result to the fragment program through that varying. Default: false. |
| `vertex?` | { `body?`: [`Expression`](Shader_Composer.md#expression) ; `header?`: [`Expression`](Shader_Composer.md#expression)  } | - |
| `vertex.body?` | [`Expression`](Shader_Composer.md#expression) | - |
| `vertex.header?` | [`Expression`](Shader_Composer.md#expression) | - |

#### Defined in

[shader-composer/src/units.ts:53](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L53)

___

### UnitState

Ƭ **UnitState**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lastUpdateAt` | `number` \| `undefined` |

#### Defined in

[shader-composer/src/units.ts:123](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L123)

___

### UpdateCallback

Ƭ **UpdateCallback**: (`dt`: `number`, `camera`: `Camera`, `scene`: `Scene`, `gl`: `WebGLRenderer`) => `void`

#### Type declaration

▸ (`dt`, `camera`, `scene`, `gl`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `dt` | `number` |
| `camera` | `Camera` |
| `scene` | `Scene` |
| `gl` | `WebGLRenderer` |

##### Returns

`void`

#### Defined in

[shader-composer/src/units.ts:46](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L46)

## Variables

### CameraFar

• `Const` **CameraFar**: [`UniformUnit`](Shader_Composer.md#uniformunit-1)<``"float"``, `number`\>

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:95](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L95)

___

### CameraNear

• `Const` **CameraNear**: [`UniformUnit`](Shader_Composer.md#uniformunit-1)<``"float"``, `number`\>

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:85](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L85)

___

### CameraPosition

• `Const` **CameraPosition**: [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L11)

___

### FragmentCoordinate

• `Const` **FragmentCoordinate**: [`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

Returns the current fragment's on-screen coordinate.

#### Defined in

[shader-composer/src/stdlib/globals.ts:7](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/globals.ts#L7)

___

### GlobalTime

• `Const` **GlobalTime**: [`UniformUnit`](Shader_Composer.md#uniformunit-1)<``"float"``, `number`\>

A global time uniform unit that can be safely used across multiple shaders,
wherever synchronization is required,
and as a default value for `time` inputs of other unit implementations, to prevent
shaders from being spammed by multiple uniforms all holding different
representations of time.

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:74](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L74)

___

### InstanceID

• `Const` **InstanceID**: [`Unit`](Shader_Composer.md#unit-1)<``"int"``\>

In instanced rendering, will return the instance ID.
Wraps the `gl_InstanceID` GLSL built-in.

Note: available in vertex shader only!

#### Defined in

[shader-composer/src/stdlib/globals.ts:18](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/globals.ts#L18)

___

### InstanceMatrix

• `Const` **InstanceMatrix**: [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

Returns the instance matrix. Please note that this is only available when
instanced rendering is enabled.

#### Defined in

[shader-composer/src/stdlib/geometry.ts:50](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L50)

___

### IsFrontFacing

• `Const` **IsFrontFacing**: [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:85](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L85)

___

### ModelMatrix

• `Const` **ModelMatrix**: [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:19](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L19)

___

### ModelViewMatrix

• `Const` **ModelViewMatrix**: [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:23](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L23)

___

### NormalMatrix

• `Const` **NormalMatrix**: [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:27](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L27)

___

### ProjectionMatrix

• `Const` **ProjectionMatrix**: [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:31](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L31)

___

### Resolution

• `Const` **Resolution**: [`UniformUnit`](Shader_Composer.md#uniformunit-1)<``"vec2"``, `Vector2`\>

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:76](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L76)

___

### ScreenUV

• `Const` **ScreenUV**: [`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:105](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L105)

___

### UV

• `Const` **UV**: [`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:55](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L55)

___

### UsingInstancing

• `Const` **UsingInstancing**: [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

Returns true if instanced rendering is enabled, false if it is not.

#### Defined in

[shader-composer/src/stdlib/geometry.ts:38](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L38)

___

### VertexID

• `Const` **VertexID**: [`Unit`](Shader_Composer.md#unit-1)<``"int"``\>

Returns the verte ID.
Wraps the `gl_VertexID` GLSL built-in.

Note: available in vertex shader only!

#### Defined in

[shader-composer/src/stdlib/globals.ts:29](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/globals.ts#L29)

___

### VertexNormal

• `Const` **VertexNormal**: [`IUnit`](../interfaces/Shader_Composer.IUnit.md)<``"vec3"``\> & { `x`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `y`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `z`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>  } & { `view`:  ; `world`:   }

#### Defined in

[shader-composer/src/stdlib/geometry.ts:78](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L78)

___

### VertexPosition

• `Const` **VertexPosition**: [`IUnit`](../interfaces/Shader_Composer.IUnit.md)<``"vec3"``\> & { `x`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `y`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> ; `z`: [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>  } & { `view`:  ; `world`:   }

#### Defined in

[shader-composer/src/stdlib/geometry.ts:77](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L77)

___

### ViewDirection

• `Const` **ViewDirection**: [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:80](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L80)

___

### ViewMatrix

• `Const` **ViewMatrix**: [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:15](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L15)

## Functions

### $

▸ **$**(`strings`, ...`values`): [`Expression`](Shader_Composer.md#expression)

A shortcut for the `glsl` tagged template literal helper.

#### Parameters

| Name | Type |
| :------ | :------ |
| `strings` | `TemplateStringsArray` |
| `...values` | `any`[] |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/expressions.ts:12](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/expressions.ts#L12)

___

### Abs

▸ **Abs**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Acos

▸ **Acos**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Add

▸ **Add**<`A`, `B`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

A Shader Unit that adds two values and returns the result.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `B` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`B`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L11)

___

### Asin

▸ **Asin**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Attribute

▸ **Attribute**<`T`\>(`type`, `name`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `T` |
| `name` | `string` |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:98](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L98)

___

### Bitangent

▸ **Bitangent**(`p`, `t`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `t` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:44](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L44)

___

### Bool

▸ **Bool**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"bool"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"bool"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### Ceil

▸ **Ceil**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Clamp

▸ **Clamp**<`T`\>(`x`, `min`, `max`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `min` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `max` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:126](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L126)

___

### Clamp01

▸ **Clamp01**(`x`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/math.ts:132](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L132)

___

### Cos

▸ **Cos**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

Calculates the cosine value of the input value.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Cross

▸ **Cross**(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `b` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:36](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L36)

___

### CustomShaderMaterialMaster

▸ **CustomShaderMaterialMaster**(`__namedParameters?`): [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`CustomShaderMaterialMasterProps`](Shader_Composer.md#customshadermaterialmasterprops) |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Defined in

[shader-composer/src/stdlib/masters.ts:45](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/masters.ts#L45)

___

### Degrees

▸ **Degrees**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

Converts the given value from radians to degrees.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Distance

▸ **Distance**<`T`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:47](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L47)

___

### Div

▸ **Div**<`A`, `B`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

A Shader Unit that divides two values and returns the result.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `B` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`B`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L11)

___

### Dot

▸ **Dot**<`T`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:39](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L39)

___

### Exp

▸ **Exp**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Exp2

▸ **Exp2**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Float

▸ **Float**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"float"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### Floor

▸ **Floor**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Fract

▸ **Fract**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Fresnel

▸ **Fresnel**(`__namedParameters?`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`FresnelProps`](Shader_Composer.md#fresnelprops) |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/artistic.ts:17](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/artistic.ts#L17)

___

### Gradient

▸ **Gradient**<`T`\>(`f`, ...`stops`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) = ``"vec3"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Input`](Shader_Composer.md#input)<``"float"``\> |
| `...stops` | [`GradientStops`](Shader_Composer.md#gradientstops)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/artistic.ts:45](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/artistic.ts#L45)

___

### GreaterOrEqual

▸ **GreaterOrEqual**<`T`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Defined in

[shader-composer/src/stdlib/logic.ts:12](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/logic.ts#L12)

___

### If

▸ **If**<`T`\>(`expression`, `then`, `else_`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | [`Input`](Shader_Composer.md#input)<``"bool"``\> |
| `then` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `else_` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/logic.ts:6](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/logic.ts#L6)

___

### Int

▸ **Int**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"int"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"int"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"int"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"int"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### InverseLerp

▸ **InverseLerp**<`T`\>(`a`, `b`, `c`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

Performs inverse linear interpolation between two values, and returns the result.
Given three values `a`, `b`, and `c`, the result is the ratio of `c` between `a` and `b`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> | The starting value of the interpolation. |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> | The ending value of the interpolation. |
| `c` | [`Input`](Shader_Composer.md#input)<`T`\> | The value to find the interpolation ratio of. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

The interpolation ratio of `c` between `a` and `b`.

#### Defined in

[shader-composer/src/stdlib/math.ts:194](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L194)

___

### InverseSqrt

▸ **InverseSqrt**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Length

▸ **Length**<`T`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:52](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L52)

___

### Lerp

▸ **Lerp**<`T`\>(`a`, `b`, `ratio`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

Performs linear interpolation between two values, and returns the result.

Wraps the GLSL `mix` function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> | The starting value of the interpolation. |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> | The ending value of the interpolation. |
| `ratio` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The interpolation ratio. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

The interpolated value.

#### Defined in

[shader-composer/src/stdlib/math.ts:173](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L173)

___

### LocalToViewSpace

▸ **LocalToViewSpace**(`position`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

Converts the given position vector (which is assumed to be in local space)
to view space.

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/spaces.ts:33](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/spaces.ts#L33)

___

### LocalToWorldSpace

▸ **LocalToWorldSpace**(`position`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

Converts the given position vector (which is assumed to be in local space)
to world space.

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/spaces.ts:40](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/spaces.ts#L40)

___

### Log

▸ **Log**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Log2

▸ **Log2**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Master

▸ **Master**(`extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"bool"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:17](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L17)

___

### Mat3

▸ **Mat3**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"mat3"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"mat3"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### Mat4

▸ **Mat4**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"mat4"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"mat4"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### Max

▸ **Max**<`T`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:255](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L255)

___

### Min

▸ **Min**<`T`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:250](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L250)

___

### Mix

▸ **Mix**<`T`\>(`a`, `b`, `ratio`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

Performs linear interpolation between two values, and returns the result.

Wraps the GLSL `mix` function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> | The starting value of the interpolation. |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> | The ending value of the interpolation. |
| `ratio` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The interpolation ratio. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

The interpolated value.

#### Defined in

[shader-composer/src/stdlib/math.ts:173](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L173)

___

### Modulo

▸ **Modulo**<`A`, `B`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |
| `B` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`B`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:118](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L118)

___

### Mul

▸ **Mul**<`A`, `B`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

A Shader Unit that multiplies two values and returns the result.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `B` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`B`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L11)

___

### Negate

▸ **Negate**<`T`\>(`v`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

Negates the value (equivalent to multiplying it with -1.)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<`T`\> | Value to negate. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

A shader unit holding the negated value.

#### Defined in

[shader-composer/src/stdlib/math.ts:145](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L145)

___

### Normalize

▸ **Normalize**<`T`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

Returns the normalized (unit length) version of a given vector.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> | The vec2/3/4 input value to normalize. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

A new Shader Unit containing the normalized value of `a`.

#### Defined in

[shader-composer/src/stdlib/vectors.ts:33](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L33)

___

### NormalizePlusMinusOne

▸ **NormalizePlusMinusOne**(`f`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `f` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/math.ts:247](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L247)

___

### OneMinus

▸ **OneMinus**(`v`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/math.ts:136](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L136)

___

### Operator

▸ **Operator**(`name`, `operator`): <A, B\>(`a`: [`Input`](Shader_Composer.md#input)<`A`\>, `b`: [`Input`](Shader_Composer.md#input)<`B`\>) => [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `operator` | ``"+"`` \| ``"-"`` \| ``"*"`` \| ``"/"`` |

#### Returns

`fn`

▸ <`A`, `B`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `B` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`B`\> |

##### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:10](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L10)

___

### PerspectiveDepth

▸ **PerspectiveDepth**(`xy`, `depthTexture`, `cameraNear?`, `cameraFar?`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

Sample a depth texture and return the depth value in eye space units.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `xy` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> | `undefined` | Screen position |
| `depthTexture` | [`Unit`](Shader_Composer.md#unit-1)<``"sampler2D"``\> | `undefined` | Depth texture to sample |
| `cameraNear` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `CameraNear` | Camera near plane (defaults to CameraNear) |
| `cameraFar` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `CameraFar` | Camera far plane (defaults to CameraFar) |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

Float unit containing the depth in eye space units

#### Defined in

[shader-composer/src/stdlib/scene.ts:32](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/scene.ts#L32)

___

### Pow

▸ **Pow**<`T`\>(`a`, `e`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `e` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:63](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L63)

___

### Radians

▸ **Radians**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

Converts the given value from degrees to radians.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### RawDepth

▸ **RawDepth**(`uv`, `depthTexture`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

Sample a depth texture and return the raw depth value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uv` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> | Screen UV |
| `depthTexture` | [`Unit`](Shader_Composer.md#unit-1)<``"sampler2D"``\> | Depth texture to sample |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

Float unit containing the depth as stored in the texture

#### Defined in

[shader-composer/src/stdlib/scene.ts:18](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/scene.ts#L18)

___

### Reflect

▸ **Reflect**<`T`\>(`vector`, `normal`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `normal` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:55](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L55)

___

### Refract

▸ **Refract**<`T`\>(`vector`, `normal`, `eta`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `normal` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `eta` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:63](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L63)

___

### Remap

▸ **Remap**<`T`\>(`value`, `inMin`, `inMax`, `outMin`, `outMax`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `inMin` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `inMax` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `outMin` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `outMax` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:239](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L239)

___

### Rotate3D

▸ **Rotate3D**(`position`, `axis`, `angle`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

Rotate a vector around the specified axis.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> | Vector to rotate. |
| `axis` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> | The axis to rotate around. |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The angle (amount) to rotate around the axis. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

A `vec3` Shader Unit containing the rotated vector.

#### Defined in

[shader-composer/src/stdlib/rotation.ts:34](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L34)

___

### RotateX

▸ **RotateX**(`position`, `angle`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/rotation.ts:40](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L40)

___

### RotateY

▸ **RotateY**(`position`, `angle`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/rotation.ts:43](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L43)

___

### RotateZ

▸ **RotateZ**(`position`, `angle`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/rotation.ts:46](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L46)

___

### Rotation3D

▸ **Rotation3D**(`axis`, `angle`): [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

Generates a Shader Unit of type `mat4` representing a rotation around a specified
axis, by a specified amount/angle. This unit can then be multiplied with a
`vec3` unit in order to apply the rotation to that vector.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `axis` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> | Axis to rotate around. |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The angle (amount) to rotate. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

A Shader Unit of type `mat4` representing the rotation matrix.

#### Defined in

[shader-composer/src/stdlib/rotation.ts:17](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L17)

___

### Rotation3DX

▸ **Rotation3DX**(`angle`): [`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Defined in

[shader-composer/src/stdlib/rotation.ts:20](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L20)

___

### Rotation3DY

▸ **Rotation3DY**(`angle`): [`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Defined in

[shader-composer/src/stdlib/rotation.ts:22](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L22)

___

### Rotation3DZ

▸ **Rotation3DZ**(`angle`): [`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `angle` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Defined in

[shader-composer/src/stdlib/rotation.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/rotation.ts#L24)

___

### Round

▸ **Round**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

A Shader Unit that finds the nearest integer to the input value.
It performs the GLSL expression `round(a)`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> | The input value. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

The rounded value of `a`.

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Saturate

▸ **Saturate**(`x`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/math.ts:132](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L132)

___

### SceneColor

▸ **SceneColor**(`uv`, `texture`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uv` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> |
| `texture` | [`Unit`](Shader_Composer.md#unit-1)<``"sampler2D"``\> |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | ``"Unit"`` | - |
| `_unitConfig` | [`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec4"``\> | - |
| `_unitState` | [`UnitState`](Shader_Composer.md#unitstate)<``"vec4"``\> | - |
| `alpha` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | The alpha value sampled from the texture. |
| `color` | [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\> | The color value sampled from the texture. |
| `w` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |
| `x` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |
| `y` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |
| `z` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |

#### Defined in

[shader-composer/src/stdlib/scene.ts:8](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/scene.ts#L8)

___

### ShaderMaterialMaster

▸ **ShaderMaterialMaster**(`__namedParameters?`): [`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ShaderMaterialMasterProps`](Shader_Composer.md#shadermaterialmasterprops) |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"bool"``\>

#### Defined in

[shader-composer/src/stdlib/masters.ts:13](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/masters.ts#L13)

___

### Sign

▸ **Sign**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Sin

▸ **Sin**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

Calculates the sine value of the input value.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### SingleArgumentFunction

▸ **SingleArgumentFunction**<`TA`\>(`name`, `functionName`): <A\>(`a`: [`Input`](Shader_Composer.md#input)<`A`\>) => [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TA` | extends [`GLSLType`](Shader_Composer.md#glsltype) = ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `functionName` | `string` |

#### Returns

`fn`

▸ <`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

##### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:20](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L20)

___

### Smoothstep

▸ **Smoothstep**(`min`, `max`, `v`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

Performs a Hermite interpolation between two values, and returns the result.

Wraps the GLSL `smoothstep` function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The lower edge of the Hermite einterpolation. |
| `max` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The upper edge of the Hermite interpolation. |
| `v` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The source value for the interpolation. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

The result of the Hermite interpolation.

#### Defined in

[shader-composer/src/stdlib/math.ts:225](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L225)

___

### Snippet

▸ **Snippet**(`render`): [`Snippet`](Shader_Composer.md#snippet-1)

#### Parameters

| Name | Type |
| :------ | :------ |
| `render` | (`name`: `string`) => [`Expression`](Shader_Composer.md#expression) |

#### Returns

[`Snippet`](Shader_Composer.md#snippet-1)

#### Defined in

[shader-composer/src/snippets.ts:10](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/snippets.ts#L10)

___

### SplitVector2

▸ **SplitVector2**(`vector`): readonly [[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>]

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> |

#### Returns

readonly [[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>]

#### Defined in

[shader-composer/src/stdlib/vectors.ts:6](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L6)

___

### SplitVector3

▸ **SplitVector3**(`vector`): readonly [[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>]

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

readonly [[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>]

#### Defined in

[shader-composer/src/stdlib/vectors.ts:9](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L9)

___

### SplitVector4

▸ **SplitVector4**(`vector`): readonly [[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>]

#### Parameters

| Name | Type |
| :------ | :------ |
| `vector` | [`Input`](Shader_Composer.md#input)<``"vec4"``\> |

#### Returns

readonly [[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>, [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>]

#### Defined in

[shader-composer/src/stdlib/vectors.ts:12](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L12)

___

### Sqrt

▸ **Sqrt**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Step

▸ **Step**(`edge`, `v`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

Given an `edge` value and an input value `v`, returns 0 if the value is less than the
edge, and 1 if the value is greater than or equal to the edge.

Wraps the GLSL `step` function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `edge` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The edge value. |
| `v` | [`Input`](Shader_Composer.md#input)<``"float"``\> | The value to test. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

The result of the step function.

#### Defined in

[shader-composer/src/stdlib/math.ts:212](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L212)

___

### Sub

▸ **Sub**<`A`, `B`\>(`a`, `b`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

A Shader Unit that subtracts two values and returns the result.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `B` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`B`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L11)

___

### Tan

▸ **Tan**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### Tangent

▸ **Tangent**(`v`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/vectors.ts:42](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L42)

___

### Texture2D

▸ **Texture2D**(`sampler2D`, `xy`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sampler2D` | [`Unit`](Shader_Composer.md#unit-1)<``"sampler2D"``\> |
| `xy` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | ``"Unit"`` | - |
| `_unitConfig` | [`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec4"``\> | - |
| `_unitState` | [`UnitState`](Shader_Composer.md#unitstate)<``"vec4"``\> | - |
| `alpha` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | The alpha value sampled from the texture. |
| `color` | [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\> | The color value sampled from the texture. |
| `w` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |
| `x` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |
| `y` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |
| `z` | [`Unit`](Shader_Composer.md#unit-1)<``"float"``\> | - |

#### Defined in

[shader-composer/src/stdlib/textures.ts:5](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/textures.ts#L5)

___

### TilingUV

▸ **TilingUV**(`uv?`, `tiling?`, `offset?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `uv` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> | `UV` |
| `tiling` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> | `undefined` |
| `offset` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> | `undefined` |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Defined in

[shader-composer/src/stdlib/geometry.ts:87](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/geometry.ts#L87)

___

### Time

▸ **Time**(`initial?`): [`UniformUnit`](Shader_Composer.md#uniformunit-1)<``"float"``, `number`\>

Provides a uniform unit holding a representation of time. The time value
stored is not an absolute time, so multiple instances of this unit will not
be synchronized. If you require synchronization, please either reuse the
same instance of this unit, or use `GlobalTime` instead.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `initial` | `number` | `0` | The initial time value to start with. (Default: 0) |

#### Returns

[`UniformUnit`](Shader_Composer.md#uniformunit-1)<``"float"``, `number`\>

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:55](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L55)

___

### Trunc

▸ **Trunc**<`A`\>(`a`): [`Unit`](Shader_Composer.md#unit-1)<`A`\>

A Shader Unit that finds the nearest integer less than or equal to the input value.
It is equivalent to the GLSL expression `trunc(a)`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`A`\> | The input value. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`A`\>

The truncated value of `a`.

#### Defined in

[shader-composer/src/stdlib/math.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L24)

___

### UniformUnit

▸ **UniformUnit**<`T`, `J`\>(`type`, `initialValue`, `extras?`): [`UniformUnit`](Shader_Composer.md#uniformunit-1)<`T`, `J`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |
| `J` | extends `number` \| `boolean` \| `Vector2` \| `Vector3` \| `Color` \| `Vector4` \| `Matrix3` \| `Matrix4` \| `Texture` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `T` |
| `initialValue` | `J` |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<`T`\>\> |

#### Returns

[`UniformUnit`](Shader_Composer.md#uniformunit-1)<`T`, `J`\>

#### Defined in

[shader-composer/src/stdlib/uniforms.ts:21](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/uniforms.ts#L21)

___

### Unit

▸ **Unit**<`T`\>(`type`, `value`, `_config?`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `T` |
| `value` | `undefined` \| [`Input`](Shader_Composer.md#input)<`T`\> |
| `_config?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<`T`\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/units.ts:201](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L201)

___

### Vec2

▸ **Vec2**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec2"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec2"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### Vec3

▸ **Vec3**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec3"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### Vec4

▸ **Vec4**(`v`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec4"``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec4"``\> |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec4"``\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec4"``\>

#### Defined in

[shader-composer/src/stdlib/values.ts:3](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/values.ts#L3)

___

### collectFromTree

▸ **collectFromTree**(`root`, `program`, `check?`): `any`[]

Walks the tree and returns all items found where the given callback function
returns true.

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `any` |
| `program` | [`Program`](Shader_Composer.md#program) \| ``"any"`` |
| `check?` | (`item`: `any`) => `boolean` |

#### Returns

`any`[]

#### Defined in

[shader-composer/src/tree.ts:38](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/tree.ts#L38)

___

### compileShader

▸ **compileShader**(`root`): readonly [{ `fragmentShader`: `string` ; `uniforms`: `any` ; `vertexShader`: `string`  }, { `dispose`: () => `void` ; `update`: (`dt`: `number`, `camera`: `Camera`, `scene`: `Scene`, `gl`: `WebGLRenderer`) => `void`  }]

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`Unit`](Shader_Composer.md#unit-1)<[`GLSLType`](Shader_Composer.md#glsltype)\> |

#### Returns

readonly [{ `fragmentShader`: `string` ; `uniforms`: `any` ; `vertexShader`: `string`  }, { `dispose`: () => `void` ; `update`: (`dt`: `number`, `camera`: `Camera`, `scene`: `Scene`, `gl`: `WebGLRenderer`) => `void`  }]

#### Defined in

[shader-composer/src/compiler.ts:187](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/compiler.ts#L187)

___

### float

▸ **float**(`v?`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"bool"`` \| ``"int"`` \| ``"float"``\> | `0` |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"float"``\>\> | `undefined` |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"float"``\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:6](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L6)

___

### getDependencies

▸ **getDependencies**(`item`, `program`): `any`[]

Given a unit, expression o snippet, returns that item's dependencies.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `program` | [`Program`](Shader_Composer.md#program) \| ``"any"`` |

#### Returns

`any`[]

#### Defined in

[shader-composer/src/tree.ts:60](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/tree.ts#L60)

___

### glsl

▸ **glsl**(`strings`, ...`values`): [`Expression`](Shader_Composer.md#expression)

#### Parameters

| Name | Type |
| :------ | :------ |
| `strings` | `TemplateStringsArray` |
| `...values` | `any`[] |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/expressions.ts:12](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/expressions.ts#L12)

___

### glslType

▸ **glslType**<`T`\>(`value`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

`T`

#### Defined in

[shader-composer/src/glslType.ts:4](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/glslType.ts#L4)

___

### injectAPI

▸ **injectAPI**<`U`, `A`\>(`unit`, `factory`): `U` & `A`

Given a unit and an API factory function, pass the unit to the factory
function and inject its return value into the unit (as to not break
object references.)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`IUnit`](../interfaces/Shader_Composer.IUnit.md)<[`GLSLType`](Shader_Composer.md#glsltype), `U`\> |
| `A` | extends [`API`](Shader_Composer.md#api) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `unit` | `U` |
| `factory` | [`APIFactory`](Shader_Composer.md#apifactory)<`U`, `A`\> |

#### Returns

`U` & `A`

#### Defined in

[shader-composer/src/units.ts:253](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L253)

___

### inverseLerp

▸ **inverseLerp**<`T`\>(`a`, `b`, `c`): [`Expression`](Shader_Composer.md#expression)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `c` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/stdlib/math.ts:179](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L179)

___

### isExpression

▸ **isExpression**(`v`): v is Expression

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `any` |

#### Returns

v is Expression

#### Defined in

[shader-composer/src/expressions.ts:32](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/expressions.ts#L32)

___

### isSnippet

▸ **isSnippet**(`x`): x is Snippet

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `any` |

#### Returns

x is Snippet

#### Defined in

[shader-composer/src/snippets.ts:27](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/snippets.ts#L27)

___

### isUnit

▸ **isUnit**(`value`): value is Unit<GLSLType\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

value is Unit<GLSLType\>

#### Defined in

[shader-composer/src/units.ts:228](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L228)

___

### isUnitInProgram

▸ **isUnitInProgram**(`unit`, `program`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `unit` | [`Unit`](Shader_Composer.md#unit-1)<[`GLSLType`](Shader_Composer.md#glsltype)\> |
| `program` | [`Program`](Shader_Composer.md#program) |

#### Returns

`boolean`

#### Defined in

[shader-composer/src/units.ts:239](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L239)

___

### localToViewSpace

▸ **localToViewSpace**(`v`): [`Expression`](Shader_Composer.md#expression)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/stdlib/spaces.ts:8](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/spaces.ts#L8)

___

### localToWorldSpace

▸ **localToWorldSpace**(`v`): [`Expression`](Shader_Composer.md#expression)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/stdlib/spaces.ts:19](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/spaces.ts#L19)

___

### mat3

▸ **mat3**(`i`): [`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

Cast the given value to a mat3.

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | [`Input`](Shader_Composer.md#input)<``"mat3"`` \| ``"mat4"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat3"``\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:33](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L33)

___

### mat4

▸ **mat4**(`i`): [`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

Cast the given value to a mat4.

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | [`Input`](Shader_Composer.md#input)<``"mat3"`` \| ``"mat4"``\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"mat4"``\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:36](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L36)

___

### orthogonal

▸ **orthogonal**(`v`): [`Expression`](Shader_Composer.md#expression)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Input`](Shader_Composer.md#input)<``"vec3"``\> |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/stdlib/vectors.ts:20](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/vectors.ts#L20)

___

### remap

▸ **remap**<`T`\>(`value`, `inMin`, `inMax`, `outMin`, `outMax`): [`Expression`](Shader_Composer.md#expression)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"float"`` \| ``"vec2"`` \| ``"vec3"`` \| ``"vec4"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `inMin` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `inMax` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `outMin` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `outMax` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/stdlib/math.ts:231](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L231)

___

### renameSnippet

▸ **renameSnippet**(`snippet`, `name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `snippet` | [`Snippet`](Shader_Composer.md#snippet-1) |
| `name` | `string` |

#### Returns

`void`

#### Defined in

[shader-composer/src/snippets.ts:22](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/snippets.ts#L22)

___

### type

▸ **type**<`T`\>(`value`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Input`](Shader_Composer.md#input)<`T`\> |

#### Returns

`T`

#### Defined in

[shader-composer/src/glslType.ts:4](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/glslType.ts#L4)

___

### uniformName

▸ **uniformName**(`unit`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `unit` | [`Unit`](Shader_Composer.md#unit-1)<[`GLSLType`](Shader_Composer.md#glsltype)\> |

#### Returns

`string`

#### Defined in

[shader-composer/src/units.ts:242](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/units.ts#L242)

___

### unit

▸ **unit**<`T`\>(`i`, `config?`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `config?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<`T`\>\> |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:38](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L38)

___

### varying

▸ **varying**<`T`\>(`i`, `config?`): [`Unit`](Shader_Composer.md#unit-1)<`T`\>

Wraps an input value into a unit that is configured to use a varying.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | [`Input`](Shader_Composer.md#input)<`T`\> | Input value (unit, JS value or expression) to wrap in a varying unit. |
| `config?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<`T`\>\> | Optional extra configuration for the newly created unit. |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<`T`\>

A new unit that wraps the given value and is configured to use a varying.

#### Defined in

[shader-composer/src/stdlib/casts.ts:48](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L48)

___

### vec2

▸ **vec2**(`x?`, `y?`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `x` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `y` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec2"``\>\> | `undefined` |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec2"``\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:11](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L11)

___

### vec3

▸ **vec3**(`x?`, `y?`, `z?`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `x` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `y` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `z` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec3"``\>\> | `undefined` |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec3"``\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:17](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L17)

___

### vec4

▸ **vec4**(`x?`, `y?`, `z?`, `w?`, `extras?`): [`Unit`](Shader_Composer.md#unit-1)<``"vec4"``\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `x` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `y` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `z` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `w` | [`Input`](Shader_Composer.md#input)<``"float"``\> | `0` |
| `extras?` | `Partial`<[`UnitConfig`](Shader_Composer.md#unitconfig)<``"vec4"``\>\> | `undefined` |

#### Returns

[`Unit`](Shader_Composer.md#unit-1)<``"vec4"``\>

#### Defined in

[shader-composer/src/stdlib/casts.ts:24](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/casts.ts#L24)

___

### walkTree

▸ **walkTree**(`item`, `program`, `callback`, `seen?`): `void`

Given a root unit, iterate over the tree and invoke the given callback for each
item encountered. Items include units, expressions, snippets, and any constant
values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `any` | The root of the tree to traverse. |
| `program` | [`Program`](Shader_Composer.md#program) \| ``"any"`` | - |
| `callback` | (`item`: `any`) => `void` | The callback to execute for each item. |
| `seen` | `Set`<`any`\> | - |

#### Returns

`void`

#### Defined in

[shader-composer/src/tree.ts:15](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/tree.ts#L15)

## Math

### lerp

▸ **lerp**<`T`\>(`a`, `b`, `ratio`): [`Expression`](Shader_Composer.md#expression)

Lerpy fun!

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`GLSLType`](Shader_Composer.md#glsltype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `b` | [`Input`](Shader_Composer.md#input)<`T`\> |
| `ratio` | [`Input`](Shader_Composer.md#input)<``"float"``\> |

#### Returns

[`Expression`](Shader_Composer.md#expression)

#### Defined in

[shader-composer/src/stdlib/math.ts:157](https://github.com/hmans/composer-suite/blob/c98d7ee3/packages/shader-composer/src/stdlib/math.ts#L157)
