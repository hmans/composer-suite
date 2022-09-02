[Shader Composer (R3F)](README.md) / Exports

# Shader Composer (R3F)

## Table of contents

### Functions

- [useShader](modules.md#useshader)
- [useUniformUnit](modules.md#useuniformunit)

## Functions

### useShader

▸ **useShader**(`ctor`, `deps?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctor` | () => `Unit`<`GLSLType`\> |
| `deps?` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `fragmentShader` | `string` |
| `uniforms` | `any` |
| `vertexShader` | `string` |

#### Defined in

[shader-composer-r3f/src/hooks.ts:12](https://github.com/hmans/composer-suite/blob/be64faec/packages/shader-composer-r3f/src/hooks.ts#L12)

___

### useUniformUnit

▸ **useUniformUnit**<`T`\>(`type`, `value`, `config?`): `UniformUnit`<`T`, `JSTypes`[`T`]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `GLSLType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `T` |
| `value` | `JSTypes`[`T`] |
| `config?` | `Partial`<`UnitConfig`<`T`\>\> |

#### Returns

`UniformUnit`<`T`, `JSTypes`[`T`]\>

#### Defined in

[shader-composer-r3f/src/hooks.ts:26](https://github.com/hmans/composer-suite/blob/be64faec/packages/shader-composer-r3f/src/hooks.ts#L26)
